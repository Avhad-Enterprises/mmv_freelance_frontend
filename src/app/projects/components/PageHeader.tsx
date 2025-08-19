import React from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="container my-5 mt-30 mb-5">
      <div className="text-center">
        <h1 className="display-5 fw-bold mb-3">{title}</h1>
        <p className="lead text-muted">{description}</p>
      </div>
    </div>
  );
}
