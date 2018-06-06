import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import firebase from "firebase";
import Admin from './components/Admin/Admin'

const config = {
  
};

firebase.initializeApp(config);

class App extends Component {

  state = {
    lerningData : [],
    editing: false,
    word: '',
    translete: '',
    randomItem: {
      word: 'Rrending well be started',
      translate: 'waiting...'
    },
    hoverItem: false
  }

  ref = null;


  componentDidMount() {
    this.ref = firebase.database().ref();
    this.getData();
    // this.auth();
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
        this.setState({randomItem: _data[Math.floor(Math.random()*this.state.lerningData.length)]})
        setInterval(this.randomItemF, 5000);
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

    randomItemF = () => {
      if (this.state.hoverItem)
      this.setState({randomItem: this.state.lerningData[Math.floor(Math.random()*this.state.lerningData.length)]}) ;
    }

    // showRandom = () => {
    //   setInterval(this.randomItemF, 1000);
    //   if (this.state.lerningData.length> 0){

        
      
    //     return (
    //       <div className='main-item'>
    //         <div className="item">
    //             <span>{this.state.randomItem.word}</span>      <br/>   
    //             <span className="translate">{this.state.randomItem.translate}</span>     <br/>    

    //             <button className="btn-hide-word">Hide</button>    
    //         </div> 
    //       </div>
    //     )
        
    //   }
    
    // }

   

  render() {
    
    return (
     <div>
    <Admin/>

     
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
        <div className='main-item'
         onMouseOver={() => this.setState({hoverItem: true})}
         onMouseLeave={() => this.setState({hoverItem: false})}
         >
            <div className="item">
                <span>{this.state.randomItem.word}</span>      <br/>   
                <span className="translate">{this.state.randomItem.translate}</span>     <br/>    

                <button className="btn-hide-word">Hide</button>    
            </div> 
          </div>
     
      </div>
  }
    
     
   
     </div>
    )
  }
}

export default App;



 