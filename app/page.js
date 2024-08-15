'use client';

import Image from "next/image";
import getStripe from '@/utils/get.stripe';
import { Container, AppBar, Toolbar, Button, Typography, Box, Grid } from '@mui/material';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from 'next/head';
import CustomSWRConfig from '../customSWRConfig.js';

export default function Home() {
  return (
    <ClerkProvider>
      <CustomSWRConfig>
        <Container maxWidth="100vw">
          <Head>
            <title>Flashcard SaaS</title>
            <meta name="description" content="Create flashcard from your text"></meta>
          </Head>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" style= {{flexGrow:1}} > Flashcard SaaS</Typography>
              <SignedOut>
                <Button color= "inherit">Login</Button>
                <Button color= "inherit">Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </AppBar>

          <Box sx={{
            textAlign: 'center', my: 4,
          }}>
            <Typography variant="h2">Welcome to Flashcard SaaS</Typography>
            <Typography variant="h5"> 
              {' '}
              The Easiest way to make flashcards from your text
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>
              Get Started
              </Button>
          </Box>

          <Box sx = {{my: 6}}>
            <Typography varaint="h4" components= "h2">
              Features
            </Typography>
            <Grid contained spacing = {4}>
              <Grid item xs={12} md={4}></Grid>
              <Typography variant="h6">Easy Text Input</Typography>
              <Typography> 
                {' '}
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>
            </Grid>
            <Grid item xs={12} md={4}></Grid>
              <Typography variant="h6">Smart Flashcards</Typography>
              <Typography> 
                {' '}
                Our AI inteligently breaks down your text into concise flashcards, perfect for studying.</Typography>
              <Grid item xs={12} md={4}></Grid>
              <Typography variant="h6">Accessible anywhere</Typography>
              <Typography> 
                {' '}
                Access your flashcards from any device at any time. Study on the go with ease</Typography>
          </Box>


        </Container>
      </CustomSWRConfig>
    </ClerkProvider>
  );
}
