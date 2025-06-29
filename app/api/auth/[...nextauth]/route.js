import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          await connectToDB();
          
          // Buscar usuario por email
          const user = await User.findOne({ email: credentials.email });
          
          if (!user || !user.password) {
            return null;
          }
          
          // Verificar contraseña
          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Devolver usuario sin contraseña
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectToDB();
        
        // Check if user exists
        const userExists = await User.findOne({ email: user.email });
        
        // If not, create a new user
        if (!userExists) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error checking if user exists: ', error);
        return false;
      }
    },
    async session({ session }) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: session.user.email });
        
        if (userExists) {
          session.user.id = userExists._id.toString();
          session.user.role = userExists.role || 'user';
          session.user.image = userExists.image;
          session.user.bio = userExists.bio;
          session.user.phone = userExists.phone;
          session.user.github = userExists.github;
        }
        
        return session;
      } catch (error) {
        console.error('Error in session callback: ', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
