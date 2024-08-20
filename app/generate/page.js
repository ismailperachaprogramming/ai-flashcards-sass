'use client'
import { Grid, Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField, Typography, AppBar, Toolbar } from "@mui/material"
import { useUser } from '@clerk/nextjs'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'
import { db } from "@/firebase"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Link from 'next/link'


const theme = createTheme({
  palette: {
    primary: {
      main: '#7851A9', 
    },
    secondary: {
      main: '#f1f1f1',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
})

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists.')
        return
      } else {
        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleClose()
    router.push('/flashcards')
  }

  return (
    <ThemeProvider theme={theme}>
      {/* Navbar - Full Width */}
      <AppBar position="static" sx={{ bgcolor: '#7851A9', mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Flashcard Generator
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        {/* Generate Flashcards Section */}
        <Box sx={{ mt: 6, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            Generate Flashcards
          </Typography>
          <Paper sx={{ p: 4, width: '100%', backgroundColor: '#fdfdfd', borderRadius: 2, boxShadow: 3 }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              sx={{ p: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              Submit
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
              Flashcards Preview
            </Typography>
            <Grid container spacing={4}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: 2, boxShadow: 4 }}>
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box
                          sx={{
                            perspective: '1000px',
                            '& > div': {
                              transition: 'transform 0.6s',
                              transformStyle: 'preserve-3d',
                              position: 'relative',
                              width: '100%',
                              height: '200px',
                            },
                            '& > div > div': {
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              backgroundColor: '#f1f1f1',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              wordWrap: 'break-word',
                            },
                            '& > div > .back': {
                              transform: 'rotateY(180deg)',
                              backgroundColor: '#f1f1f1',
                              color: '#333',
                            },
                          }}
                        >
                          <div style={{ transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                            <div className="front">
                              <Typography
                                variant="h6"
                                component="div"
                                color="primary"
                                sx={{ fontWeight: 'bold', textAlign: 'center' }}
                              >
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div className="back">
                              <Typography
                                variant="h6"
                                component="div"
                                color="primary"
                                sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.875rem' }} // Small font size
                              >
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleOpen} sx={{ fontWeight: 'bold' }}>
                Save
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter a name for your flashcards collection</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  )
}
