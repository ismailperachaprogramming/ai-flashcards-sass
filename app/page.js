'use client';

import Image from "next/image";
import getStripe from '@/utils/get.stripe';
import { Container, AppBar, Toolbar, Button, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from 'next/head';
import CustomSWRConfig from '../customSWRConfig.js';

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      }
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <CustomSWRConfig>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      {/* AppBar placed outside of the Container to extend its width */}
      <AppBar position="static" sx={{ bgcolor: '#5e3ea1', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ bgcolor: '#f0f4f8', minHeight: '100vh', py: 0 }}>
        <Box textAlign="center" sx={{ my: 4 }}>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" color="textSecondary">
            The easiest way to create flashcards from your text.
          </Typography>
          <Box display='flex' alignItems='center' justifyContent='center' gap={2}>
            <Button variant="contained" sx={{ bgcolor: '#5e3ea1', mt: 4, py: 1.5, px: 5 }} href='/generate'>
              Get Started
            </Button>
            <Button variant="contained" sx={{ bgcolor: '#5e3ea1', mt: 4, py: 1.5, px: 5 }} href='/flashcards'>
            See My Flashcards
            </Button>
          </Box>
        </Box>

        <Box sx={{ my: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
            Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, height: '100%', textAlign: 'center', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>Easy Text Input</Typography>
                  <Typography color="textSecondary">
                    Simply input your text and let our software do the rest. Creating flashcards has never been easier.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, height: '100%', textAlign: 'center', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>Smart Flashcards</Typography>
                  <Typography color="textSecondary">
                    Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, height: '100%', textAlign: 'center', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>Accessible Anywhere</Typography>
                  <Typography color="textSecondary">
                    Access your flashcards from any device at any time. Study on the go with ease.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, textAlign: 'center', boxShadow: 5 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Basic</Typography>
                  <Typography variant="h6" gutterBottom color="textSecondary">$5 / month</Typography>
                  <Typography color="textSecondary">
                    Access to basic flashcard features and limited storage.
                  </Typography>
                  <Button variant="contained" sx={{ bgcolor: '#5e3ea1', mt: 3 }}>Choose Basic</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, textAlign: 'center', boxShadow: 5 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Pro</Typography>
                  <Typography variant="h6" gutterBottom color="textSecondary">$10 / month</Typography>
                  <Typography color="textSecondary">
                    Unlimited flashcards and storage, and priority support.
                  </Typography>
                  <Button variant="contained" sx={{ bgcolor: '#5e3ea1', mt: 3 }} onClick={handleSubmit}>Choose Pro</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CustomSWRConfig>
  );
}
