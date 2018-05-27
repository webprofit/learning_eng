import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import firebase from "firebase";
import Todo from './components/to-do/to-do'

const config = {
  apiKey: "AIzaSyA1p4x8x2fMPV_lPjrNdLe53T2ILik-qBc",
  authDomain: "dictionary-27d27.firebaseapp.com",
  databaseURL: "https://dictionary-27d27.firebaseio.com",
  projectId: "dictionary-27d27",
  storageBucket: "dictionary-27d27.appspot.com",
  messagingSenderId: "948734167198"
};

firebase.initializeApp(config);

class App extends Component {

  state = {
    lerningData : [],
    editing: false,
    word: '',
    translete: ''
  }

  ref = null;


  componentDidMount() {
     this.auth();
  }

  auth = () => {
    firebase.auth().signInWithEmailAndPassword('...@gmail.com', '...')
    .catch((error) => {
      console.log(error.code); 
      console.log(error.message); 
      });

      firebase.auth().onAuthStateChanged((user) => {
      if (user){
        this.userEmail = user.email;
        this.ref = firebase.database().ref();
       
      
        this.getData();
      }
    })
  }

    getData = () => {
      const learning = this.ref.child("lerning");
      learning.on("value", (snapshot) => {
        const _data = [];
        for (const key of Object.keys(snapshot.val())) {
          const newWord = snapshot.val()[key];
          newWord.id = key;
          _data.push(newWord);
        }
        this.setState({lerningData: _data})
        }, (error) => {
       console.log("Error: " + error.code);
      });
    }
  
    addNewWord = ()  => {
     const lerning = this.ref.child("lerning");
     lerning.push ({
        word: this.state.word,
        translate: this.state.translate
      });
      this.setState({word: '', translate: ''})
    }

    moveToLearned = (id) => {
      const moveItem = this.ref.child(`lerning/${id}`);

      moveItem.once('value')
      .then((data) => {
        this.ref.child("lerned").push(data.val())
        moveItem.remove()
      })

    }

    showRandom = () => {
      if (this.state.lerningData.length> 0){

        const rondomItem = this.state.lerningData[Math.floor(Math.random()*this.state.lerningData.length)];
      
        return (
          <div className='main-item'>
            <div className="item">
                <span>{rondomItem.word}</span>      <br/>   
                <span className="translate">{rondomItem.translate}</span>         
            </div> 
          </div>
        )
        
      }
    
    }

   

  render() {
    
    return (
     <div>
    <Todo/>

     
    {/* //   this.state.lerningData.map((el, i) => 
    //   <div key={i}>
    //    <span >{el.word}</span>  
    //    <span >{el.translate}</span>  
    //    <button className="btn btn-primary" onClick={() => this.moveToLearned(el.id)}>I know</button>
      
    //   </div>
      
    // ) */}
    
    {
      this.state.editing? 
      <div>
      <button className="btn btn-danger" onClick={() => this.setState({editing: false})}>Back</button>
      <input type="text"  value={this.state.word || ''} onChange={(e) => this.setState({word: e.target.value})}/>
      <input type="text"  value={this.state.translate || ''} onChange={(e) => this.setState({translate: e.target.value})}/>
      <button className="btn btn-primary" onClick={this.addNewWord}>Add</button>
      </div>
      :
      <div>
        <button className="btn btn-danger" onClick={() => this.setState({editing: true})}>Edit</button>
      {  this.showRandom()}
      </div>
  }
    
     
   
     </div>
    )
  }
}

export default App;



 