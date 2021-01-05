import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Categories from './components/Categories'
import AddCategory from './components/AddCategory'
import PageNotFound from './components/PageNotFound'
import 'typeface-roboto'

class App extends Component {

  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
              <Route path="/Categories" component={Categories} exact/>      
              <Route path="/addCategory" component={AddCategory} exact/>            
              <Route component={PageNotFound}/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;
