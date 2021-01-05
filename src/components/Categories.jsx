import React, {useState, useEffect} from 'react'
import { AppBar, Toolbar, Button, Card, Grid, CssBaseline, Typography, CardMedia, Container,IconButton, CardContent, CardActions} from "@material-ui/core"
import {Dialog, DialogActions, DialogTitle} from '@material-ui/core'
import { makeStyles, createMuiTheme } from '@material-ui/core/styles'
import CategoryIcon from '@material-ui/icons/Category'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}
//Establecemos colores a utilizar.
const colorTema = createMuiTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#4caf50',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        dark: '#087f23',
        main: '#3d8c3f',
        contrastText: '#000',
      },
    },
  })

const useStyles = makeStyles((theme) => ({
    icon: {
      marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
      },
    heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
    },
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },
    root: {
        backgroundColor: colorTema.palette.secondary.dark,
        '&:hover': {
          backgroundColor: colorTema.palette.secondary.main,
      },
        color: colorTema.palette.primary.contrastText
      }
  }))
  
//Func cuando se presiona ver productos en cada categoría               
const verProductos = (texto) =>{
    console.log(texto)
}

//Func cuando se presiona editar en cada categoría               
const editar = (texto) =>{
  window.location.href = "/AddCategory?_id="+ texto
}

const Categories = props => {
    const classes = useStyles()
    const [list, setList] = useState([]) //Recibe las categorias guardadas desde BD
    const [state, setState] = useState({ render: false }) // Maneja el estado para renderizar los datos
    const [open, setOpen] = useState(false) //Maneja el toast para aceptar borrar la categoria
    const [openAlert, setOpenAlert] = useState(false) //Maneja el toast para cuando se ha eliminado la categoría
    const [categoría_id, setCategoría_id] = useState(" ") //Almacena el id de la categoría a borrar

    ////////////////////////////////Funciones para el control de las alertas o toast///////////////////////////////////////
    
    const handleClickOpen = (id) => {
      setCategoría_id(id)
      setOpen(true)
    }

    const handleClose = () => {
      setCategoría_id(" ")
      setOpen(false)
    }

    const handleCloseDelete = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }  
      setOpenAlert(false)  
    }
    
    /////////////////////////// Gracias al método GET se obtiene las categorías almacenas en la BD //////////////////
    useEffect(() => {
      fetch('/api/getCategories')
        .then(results => results.json())
        .then(data => {
            setList(data)
        })
        .catch(error => console.log(error))
    }, [state.render]) // Para re-renderizar
    
    // Funcion de activacion del useEffect
    const refresh = () => setState(prev => ({...prev, render: !prev.render}))
    
    /////////////////////////////////////////Func cuando se presiona borrar la categoría ///////////////////////////////////////////////              
    const borrar = (id) => {
      fetch(`/api/getCategories/${id}`, { method: 'DELETE' })
      .then(res => {
          res.json()
          setOpenAlert(true)
          setTimeout(() => {
            window.scrollTo(0, 0)
            return refresh() /// Re renderiza para visualizar las categorías que aún siguen en la BD
          }, 700)
      }).catch(error => console.log(error))
    }

    return (      
      <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <CategoryIcon className={classes.icon} />
          <Typography className={classes.title} variant="h6" color="inherit" >
            Categorías
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="md">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Categorías
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Aquí se muestran las categorías creadas, las puedes editar y/o borrar. Al dar click en el botón "AÑADIR CATEGORÍA" 
              puedes crear una nueva.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" className={classes.root} startIcon={<AddIcon />} href= "/addCategory">
                    Añadir Categoría
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {list.map((card) => (
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image= "  "
                    style={{backgroundColor: card.background}}                    
                    title= {card.name}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions > 
                    <Button size="small" variant="contained"  color="primary" onMouseDown={event => event.stopPropagation()}
                        onClick={event => {
                        event.stopPropagation()
                        event.preventDefault()
                        verProductos(card.name)
                    }}>
                        Ver productos
                    </Button>
                    <Button size="small" color={"primary"} onMouseDown={event => event.stopPropagation()}
                        onClick={event => {
                        event.stopPropagation()
                        event.preventDefault()
                        editar(card._id)
                    }}>
                        Editar
                    </Button>
                    <IconButton onClick={() => {handleClickOpen(card._id)}} variant="contained" >
                        <DeleteIcon /> 
                    </IconButton>
                    <Snackbar open = {openAlert} autoHideDuration = {4000} onClose = {handleCloseDelete}
                      anchorOrigin = {{ vertical: 'top', horizontal: 'center'}}
                      key = "snackbar3"
                      >
                      <Alert onClose = {handleCloseDelete} severity = "info">
                        Categoría eliminada !!                  
                      </Alert>
                    </Snackbar>
                    <Dialog open={open} onClose={handleClose} 
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">{"Eliminar categoría?"}</DialogTitle>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Cancelar
                        </Button>
                        <Button color="primary" autoFocus onMouseDown={event => event.stopPropagation()}
                          onClick = { event => {
                            event.stopPropagation()
                            event.preventDefault()
                            borrar(categoría_id)
                            handleClose()
                          }}>
                          Eliminar
                        </Button>        
                      </DialogActions>                       
                    </Dialog>                                     
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Juan José Rosero Calderón
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Prueba de habilidad
        </Typography>
      </footer>
      {/* End footer */}
    </React.Fragment>
    )
}


export default Categories
