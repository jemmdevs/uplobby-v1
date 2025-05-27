'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const ProjectCard = ({ project, onDelete }) => {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === project.creator._id;

  return (
    <div className="card bg-white dark:bg-[var(--mongodb-navy)] shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            {project.creator.image ? (
              <Image
                className="h-8 w-8 rounded-full"
                src={project.creator.image}
                alt={project.creator.name}
                width={32}
                height={32}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white">
                {project.creator.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {project.creator.name}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-4 py-2 rounded-md text-sm inline-block"
          >
            View Project
          </a>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Link
                href={`/projects/edit/${project._id}`}
                className="btn-secondary px-3 py-1 rounded-md text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(project._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
