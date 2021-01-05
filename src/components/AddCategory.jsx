import React, {useState, useEffect} from 'react'
import { Snackbar, AppBar, Toolbar, Button, TextField, Grid, CssBaseline, Avatar, Typography, Container, IconButton} from "@material-ui/core"
import { makeStyles, createMuiTheme } from '@material-ui/core/styles'
import {Dialog, DialogActions, DialogTitle} from '@material-ui/core'
import { SketchPicker } from 'react-color'
import CategorySharpIcon from '@material-ui/icons/CategorySharp'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

// Colores a utilizar según 
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
    delete:{
      light: '#ff5f52',
      dark: '#8e0000',
      main: '#c62828',
      contrastText: '#000',
    },
  },
})

// Estilos para el FRONT - END
const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(5),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6, 0, 6), 
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: colorTema.palette.primary.main,
    },
    icon: {
      marginRight: theme.spacing(1),
      color: colorTema.palette.primary.contrastText,
    },
    title: {
        flexGrow: 1,
      },
    form: {
      width: '100%', 
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: colorTema.palette.secondary.dark,
      '&:hover': {
        backgroundColor: colorTema.palette.secondary.main,
    }
    },
    borrar: {
      margin: theme.spacing(1, 0, 2),
      backgroundColor: colorTema.palette.delete.main,
      '&:hover': {
        backgroundColor: colorTema.palette.delete.dark,
    }
    },
    contFooter: {
      width:"100%",
      padding: theme.spacing(0, 0, 0), 
    },
  }))

const AddCategory = props => {
    const classes = useStyles()

    //Maneja el toast para aceptar borrar la categoria
    const [openDialog, setOpenDialog] = useState(false)

    // Almacena la información ingresada para nombre de la categoría, la descripción y el _id de la misma
    const [data_sign, setData_sign] = useState({})
    //name: '', description: '', _id: ''
    
    // Controla el textinput para el nombre de la categoría
    const [disabledName, setDisabledName] = useState()

       //Controla el error en el campo de texto para nombre en caso de dejarlo vacío
       const [error, setError] = useState({
        name: false, text: ""
      })    
  
      //Almacena el color seleccionado por usuario para la categoría 
      const [picker,setPicker] = useState({
        defaultColor: "#087f23", changeColor: "#087f23", color:{
          r:"8", g:"127", b:"35", a:"1"
        }
      })    
      
      //Toast para avisar que la categoría fue añadida, sobre la ocurrencia de un error o si se ha eliminado la categoria
      const [open, setOpen] = useState({
        right: false, alert: false, delete: false
      })
   
    //////////////////////// Rellena los datos de la categoría a editar gracias al _id enviado por URL //////////////////////////////////
    useEffect(() => {
      const getUrlVars = () => {
        var vars = {}
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => {
            vars[key] = value
        })
        return vars
      }
  
      const id = getUrlVars()['_id']

      if(id !== undefined){
        fetch(`/api/getCategories/${id}`)
          .then(results => results.json())
          .then(data => {
            setData_sign({...data_sign, name: data.name, description: data.description, _id: id})
            setPicker({ ...picker, color: data.background.rgb, changeColor: data.background})
            setDisabledName(true)
          })
          .catch(error => console.log(error))
        }
      else{ // Sino se envía un id
        setData_sign({...data_sign, name: "", description: ""})
        setDisabledName(false)
      }
    }, [])
 
    ////////////////////////////////Funciones para el control de las alertas o toast///////////////////////////////////////
    
    const handleClick = (text) => {
      if(text === "delete")
        setOpen({ ...open, delete: true})
      else
        text === "right" ? setOpen({ ...open, right: true}) : setOpen({ ...open, alert: true})       
    }
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }  
      setOpen({ ...open, right: false})
    }

    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }  
      setOpen({ ...open, alert: false})   
    }

    const handleCloseDelete = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }  
      setOpen({ ...open, delete: false})   
    }

    ///////////////// Manejan los eventos de apertura y cierre del toast para aceptar la eliminación de la categoría ////////////////////
    const handleClickOpenDialog = () => {
      setOpenDialog(true)
    }

    const handleCloseDialog = () => {
      setOpenDialog(false)
    }

    /////////////Funciones para atender los eventos de selección de color, del boton "añadir categoría" y los campos de texto///////////////////////////////////////
    const handlerColor = (color) =>{
      setPicker({ ...picker, color: color.rgb, changeColor: color.hex})
    }

    const handleSubmit = event => {
      event.preventDefault()
      window.scrollTo(0, 0)
      if (data_sign._id === undefined)
        data_sign.name === "" || error.name ? setError({ ...error, name: true, text: "Vacío o incorrecto" }) : añadir()
      else 
        editar()
    }
    
    const handleInputText = event => {
      setData_sign({
        ...data_sign,
        [event.target.name] : event.target.value
      })
      setError({ ...error, name: false, text: "" })
    }

    ///////////////////// Función para añadir (metiende POST) una categoría a la BD ///////////////////////////////////////
    const añadir = () => {
      var card = {}
      if (data_sign.description === "")
        card = {background: picker.changeColor , name: data_sign.name.toUpperCase() , description: "  "}
      else
        card = {background: picker.changeColor , name: data_sign.name.toUpperCase() , description: data_sign.description}
      
      fetch('/api/getCategories', {
        method: 'POST', 
        body: JSON.stringify(card), 
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => {
          res.ok ? clear() : handleClick("alert")}
        )
      .catch(error => console.error('Error:', error))
    }

    const clear = () => { /// Resetea los campos a los valores iniciales
      handleClick("right")
      setPicker({ ...picker, changeColor: "#087f23", color:{
        r:"8", g:"127", b:"35", a:"1"
      }})
      setData_sign({...data_sign, name: '', description: ''})
    } 
    
    ///////////////////// Función para editar (metiende PUT) una categoría según su _id ///////////////////////////////////////
    const editar = () => {
      var card = {}
      if (data_sign.description === "")
        card = {background: picker.changeColor , name: data_sign.name.toUpperCase() , description: "  "}
      else
        card = {background: picker.changeColor , name: data_sign.name.toUpperCase() , description: data_sign.description}
      
      fetch(`/api/getCategories/${data_sign._id}`, {
        method: 'PUT', 
        body: JSON.stringify(card), 
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => {
         handleClick("right")}
        )
      .catch(error => console.error('Error:', error))
    }

    /////////////////////////////////////////Func cuando se presiona borrar la categoría ///////////////////////////////////////////////              
    const borrar = (id) => {
     fetch(`/api/getCategories/${id}`, { method: 'DELETE' })
     .then(res => {
        res.json()
        handleClick("delete")
        window.setTimeout(() => {
          window.location.href = "/Categories"  
        }, 500) 
     }).catch(error => console.log(error))
   }

    /////////////////////////// MATERIAL UI para el FRONT- END /////////////////////////////////////
    return (
      <React.Fragment>
        <Container component = "main" maxWidth = "xs">
              <AppBar position = "fixed">
                <Toolbar>
                <IconButton className = {classes.icon}  href = "/Categories"><CategorySharpIcon /></IconButton>
                  <Typography className ={classes.title} variant = "h6" color = "inherit" >
                    { data_sign._id === undefined ? "Añadir categoría" : "Editar categoría" } 
                  </Typography>
                  <Button color = "inherit" href = "/Categories">Ver categorías</Button>
                </Toolbar>
              </AppBar>
              <Toolbar />

          <CssBaseline />
          <div className = {classes.paper}>
            <Avatar className = {classes.avatar}>
              <CategorySharpIcon />
            </Avatar>
            <Typography component = "h1" variant = "h5">
              { data_sign._id === undefined ? "Añadir categoría" : "Editar categoría" } 
            </Typography>
            <form id = "my_form" className = {classes.form} noValidate onSubmit = {handleSubmit}>
              <Grid container spacing = {2}>
                <Grid item xs = {12}>
                  <TextField
                    placeholder="Nombre"
                    label="Nombre"
                    onChange = {handleInputText}
                    error = {error.name}
                    helperText = {error.text}
                    value = {data_sign.name || ''}
                    fullWidth
                    variant = "outlined"
                    required                    
                    id = "firstName"
                    name = "name"
                    inputProps = {{ maxLength: 16 }}
                    disabled = { disabledName }                   
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField                                     
                    multiline
                    rows = {2}
                    rowsMax = {2}
                    placeholder="Descripción"
                    label="Descripción"
                    onChange = {handleInputText}
                    value = {data_sign.description || ''}
                    fullWidth
                    variant = "outlined"                    
                    id = "description"
                    name = "description"
                    inputProps = {{ maxLength: 56 }}                    
                  />
                </Grid>
                <Grid item xs={12} >
                <Typography>
                    Escoge un color para la categoría:
                </Typography>
                </Grid>                
                <Grid item xs = {12} 
                  container
                  direction = "column"
                  alignItems = "center"
                  justify = "center"                
                >
                  <SketchPicker color = {picker.changeColor} onChange={handlerColor}/>
                </Grid>                
              </Grid>
              <Button
                type = "submit"
                fullWidth
                variant = "contained"
                color = "primary"
                className = {classes.submit}
              >
                { data_sign._id === undefined ? "Añadir" : "Editar" } 
              </Button>
              {data_sign._id !== undefined ? 
                <Button
                onClick={handleClickOpenDialog}
                display = { data_sign._id === undefined ? 'none' : 'block' } 
                fullWidth
                variant = "contained"
                color = "primary"
                className = {classes.borrar}
                >
                  Borrar
                </Button>   
                : ""     
              }                           
              <Snackbar open = {open.right} autoHideDuration = {4000} onClose = {handleClose}
                anchorOrigin = {{ vertical: 'top', horizontal: 'center'}}
                key = "snackbar1"
                >
                <Alert onClose = {handleClose} severity = "success">
                  { data_sign._id === undefined ? "Categoría añadida !!" : "Categoría editada !!" }                   
                </Alert>
              </Snackbar>
              <Snackbar open = {open.alert} autoHideDuration = {4000} onClose = {handleCloseAlert}
                anchorOrigin = {{ vertical: 'top', horizontal: 'center'}}
                key = "snackbar2"
                >
                <Alert onClose = {handleCloseAlert} severity = "error">
                  Prueba con otro nombre o intenta de nuevo más tarde!!
                </Alert>
              </Snackbar>
              <Snackbar open = {open.delete} autoHideDuration = {4000} onClose = {handleCloseDelete}
                anchorOrigin = {{ vertical: 'top', horizontal: 'center'}}
                key = "snackbar3"
                >
                <Alert onClose = {handleCloseDelete} severity = "info">
                  Categoría eliminada !!                  
                </Alert>
              </Snackbar>
              <Dialog open={openDialog} onClose={handleClose} 
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Eliminar categoría?"}</DialogTitle>
                  <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                      Cancelar
                    </Button>
                    <Button color="primary" autoFocus onMouseDown={event => event.stopPropagation()}
                      onClick = { event => {
                      event.stopPropagation()
                      event.preventDefault()
                      borrar(data_sign._id)
                      handleCloseDialog()
                    }}>
                      Eliminar
                    </Button>        
                  </DialogActions>                       
              </Dialog>                                
            </form>
          </div>
        </Container>
        
        <Grid item xs = {12}>
          <footer className = {classes.footer}>
            <Typography variant = "h6" align = "center" gutterBottom>
              Juan José Rosero Calderón
            </Typography>
            <Typography variant = "subtitle1" align = "center" color = "textSecondary" component = "p">
              Prueba de habilidad
            </Typography>
          </footer>
        </Grid>   
      </React.Fragment>      
    )
}

export default AddCategory
