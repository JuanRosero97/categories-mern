import React from 'react'
import { AppBar, Toolbar, Button, Grid, CssBaseline, Typography, Container, IconButton} from "@material-ui/core"
import { makeStyles} from '@material-ui/core/styles'
import CategorySharpIcon from '@material-ui/icons/CategorySharp'
import { ReactComponent as Logo } from "../img/page_not_found.svg"

// Estilos para el FRONT - END
  const useStyles = makeStyles((theme) => ({
      footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6, 0, 6), 
      },
      heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      icon: {
        marginRight: theme.spacing(1),
        color: theme.palette.primary.contrastText,
      },
      title: {
          flexGrow: 1,
        },
      image: {
        justifyContent: 'center',
        padding: theme.spacing(0, 60, 0), 
      },
    }))


const PageNotFound = props => {
    const classes = useStyles()

    return (
        <React.Fragment >
            <AppBar position = "fixed">
              <Toolbar>
                <IconButton className = {classes.icon}  href = "/Categories"><CategorySharpIcon /></IconButton>
                  <Typography className ={classes.title} variant = "h6" color = "inherit" >
                     404 Page Not Found 
                  </Typography>
                <Button color = "inherit" href = "/Categories">Ver categorías</Button>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <CssBaseline />
            <main>
              <div className={classes.heroContent} >
                <Container maxWidth="xl">
                <Grid  container spacing={3} justify="center"  >
                    <Grid item xs={12} align="center">
                        <Logo  className={classes.image} height="100%" 
                          preserveAspectRatio="xMinYMin meet" 
                          width="100%" 
                          />
                    </Grid>

                    <Grid item xs={12} align="center">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" fontWeight="fontWeightBold" gutterBottom>
                      Opps!! Page Not Found
                    </Typography>
                    <Typography variant="h8" align="center" color="textSecondary" paragraph>
                      The page you are looking for does not exist. You can click the button below to go back to the categories.
                    </Typography>
                    <Button variant="contained" color="primary" href= "/Categories">
                      GO TO CATEGORIES
                    </Button>
                    </Grid>
                </Grid>
                </Container>
              </div>
            </main>
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


export default PageNotFound
