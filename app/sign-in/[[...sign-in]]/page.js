import {ClerkProvider, SignedIn, SignedOut, SignIn} from "@clerk/nextjs";
import {AppBar, Box, Button, Container, Toolbar, Typography} from '@mui/material'
import Link from 'next/link'

export default function SignInPage() {
    return (
        <Container maxWidth="100vw">
            <AppBar position='static' sx= {{backgroundColor: "#3f51b5"}}>
                <Toolbar>
                    <Typography variant='h6' sx={{
                        flexGrow: 1,
                    }}>
                        Flashcard SaaS
                    </Typography>
                    <Button color = "inherit" >
                        <Link href = "/sign-in" passHref>
                        Login
                        </Link>
                    </Button>
                    <Button color = "inherit" >
                        <Link href = "/sign-up" passHref>
                        Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                display = "flex"
                flexDirection= "column"
                alignItems="center"
                justifyContent="center"
            >
            <Typography variant= "h4">Sign In</Typography>
            <SignIn />
            </Box>
        </Container>
    );
}