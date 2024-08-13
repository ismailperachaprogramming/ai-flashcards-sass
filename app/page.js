import Image from "next/image";
import getStripe from '@/utils/get.stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Typography } from "@mui/material";
export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name = "description" content="Create flashcard from your text"></meta>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant = "h6">Flashcard SaaS</Typography>
          <SignedOut>
            <Button> Login</Button>
            <Button>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
        </AppBar>
    </Container>
  )
}