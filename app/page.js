'use client';

import Image from "next/image";
import getStripe from '@/utils/get.stripe';
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from 'next/head';
import CustomSWRConfig from '../customSWRConfig.js';

export default function Home() {
  return (
    <ClerkProvider>
      <CustomSWRConfig>
        <Container maxWidth="lg">
          <Head>
            <title>Flashcard SaaS</title>
            <meta name="description" content="Create flashcard from your text"></meta>
          </Head>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">Flashcard SaaS</Typography>
              <SignedOut>
                <Button>Login</Button>
                <Button>Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </AppBar>
        </Container>
      </CustomSWRConfig>
    </ClerkProvider>
  );
}
