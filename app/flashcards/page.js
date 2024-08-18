'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, CollectionReference, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button, Card, CardActionArea, CardContent, Container, Grid, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [menuAnchor, setMenuAnchor] = useState(Array(flashcards.length).fill(null));
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [newName, setNewName] = useState('');
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
    
    const handleMenuClose = (event, index) => {
        event.stopPropagation();
        const newMenuAnchor = [...menuAnchor];
        newMenuAnchor[index] = null;
        setMenuAnchor(newMenuAnchor);
    };
    
    const handleEditName = (event, flashcard) => {
        event.stopPropagation();
        setSelectedFlashcard(flashcard);
        setNewName(flashcard.name);
        setEditDialogOpen(true);
    };
    
    const handleDelete = (event, flashcard) => {
        event.stopPropagation();
        setSelectedFlashcard(flashcard);
        setDeleteDialogOpen(true);
    };

    const saveEditedName = async () => {
        if (!newName || !selectedFlashcard) return;
        
        const updatedFlashcards = flashcards.map(flashcard => {
            if (flashcard.name === selectedFlashcard.name) {
                return { ...flashcard, name: newName };
            }
            return flashcard;
        });

        const docRef = doc(collection(db, 'users'), user.id);
        await updateDoc(docRef, { flashcards: updatedFlashcards });

        setFlashcards(updatedFlashcards);
        setEditDialogOpen(false);
    };

    const confirmDelete = async () => {
        if (!selectedFlashcard) return;

        const updatedFlashcards = flashcards.filter(flashcard => flashcard.name !== selectedFlashcard.name);

        const docRef = doc(collection(db, 'users'), user.id);
        await updateDoc(docRef, { flashcards: updatedFlashcards });

        setFlashcards(updatedFlashcards);
        setDeleteDialogOpen(false);
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
                                        onClose={(event) => handleMenuClose(event, index)}
                                    >
                                        <MenuItem onClick={(event) => handleEditName(event, flashcard.name)}>Edit Name</MenuItem>
                                        <MenuItem onClick={(event) => handleDelete(event, flashcard.name)}>Delete</MenuItem>
                                    </Menu>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Edit Name Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Flashcard Set Name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a new name for the flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Name"
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveEditedName} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Flashcard Set</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the flashcard set "{selectedFlashcard?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}