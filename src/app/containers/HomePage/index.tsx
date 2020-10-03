import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from 'app/components/Navbar';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>

      <Navbar />
      <span>HomePage container</span>
    </>
  );
}
