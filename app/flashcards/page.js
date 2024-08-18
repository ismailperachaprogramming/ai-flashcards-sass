'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, CollectionReference, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [menuAnchor, setMenuAnchor] = useState(Array(flashcards.length).fill(null));
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }
    
    const handleMenuClick = (event, index) => {
        event.stopPropagation();
        const newMenuAnchor = [...menuAnchor];
        newMenuAnchor[index] = event.currentTarget;
        setMenuAnchor(newMenuAnchor);
    };
    
    const handleMenuClose = (index) => {
        const newMenuAnchor = [...menuAnchor];
        newMenuAnchor[index] = null;
        setMenuAnchor(newMenuAnchor);
    };
    
    const handleEditName = (name) => {
        // Add code for editing the name of the flashcard set
    };
    
    const handleDelete = (name) => {
        // Add code for deleting the flashcard set
    };

    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea
                                onClick={() => {
                                    handleCardClick(flashcard.name);
                                }}
                            >
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6">
                                        {flashcard.name}
                                    </Typography>
                                    <IconButton
                                        aria-label="more"
                                        aria-controls={`menu-${index}`}
                                        aria-haspopup="true"
                                        onClick={(event) => handleMenuClick(event, index)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id={`menu-${index}`}
                                        anchorEl={menuAnchor[index]}
                                        open={Boolean(menuAnchor[index])}
                                        onClose={() => handleMenuClose(index)}
                                    >
                                        <MenuItem onClick={() => handleEditName(flashcard.name)}>Edit Name</MenuItem>
                                        <MenuItem onClick={() => handleDelete(flashcard.name)}>Delete</MenuItem>
                                    </Menu>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}