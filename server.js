const express= require('express');
const app= express();
const {MongoClient}=require("mongodb");
const PORT = process.env.PORT ||8000;

// const articleInfo={
//     "learn-react":{
//         comments:[],
//     },
//     "learn-node":{
//         comments:[],
//     },
//     "my-thoughts-on-learning-react":{
//         comments:[],
//     }
// }



app.use(express.json({extended:false})); //we used to use bodyparser before but now its a buildin middleware

const withDB= async(operations,res)=>{
  try {
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017/");
    const db = client.db("mernblog");
    await operations(db);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connection database", error });
  }

}









app.post('/api/articles/:name/add-comments',(req,res)=>{
    const{username,text}=req.body
    const articleName=req.params.name
    // articleInfo[articleName].comments.push({username,text})
    // res.status(200).send(articleInfo[articleName]);
    withDB(async (db) => {
      const articleInfo = await db
        .collection("articles")
        .findOne({ name: articleName });
      await db.collection("articles").updateOne(
        { name: articleName },
        {
          $set: {
            comments: articleInfo.comments.concat({ username, text }),
          },
        }
      );
      const updateArticleInfo = await db
        .collection("articles")
        .findOne({ name: articleName });
      res.status(200).json(updateArticleInfo);
    }, res);
});

app.get('/api/article/fetch',(req,res)=>{
 res.json(articleInfo);
})







app.get('/api/articles/:name', async (req,res)=>{
  withDB(async(db)=>{
     const articleName = req.params.name;
        const articleInfo = await db
          .collection("articles")
          .findOne({ name: articleName });
          if(articleInfo){
            res.status(200).json(articleInfo);
          }
          else{
            res.status(404).json({"message":`${articleName} not found`})
          }

  })
        
    }
    
)

app.post('/calc',(req,res)=>{
    const{a,b,c}=req.body;
    let ans=0;
    if(c=='+'){
        ans=a+b;
    }
    if (c == "-") {
      ans = a - b;
    }
    if (c == "/") {
      ans = a / b;
    }
     if (c == "*") {
       ans = a*b;
     }

    
    
  res.send(`Answer is ${ans}`)



})



app.post('/',(req,res)=>res.send(`Hello ${req.body.name} and ${req.body.name2}`)); //{seen only in postman}
app.post("/add", (req, res) =>
  res.send(`Add ${req.body.a + req.body.b + req.body.c}`)
); //{seen only in postman}
app.get('/',(req,res)=>res.send("Hello,World"));//{seen in browser}

app.get("/hello/:name",(req,res) => res.send(`Hello ${req.params.name}`));
app.listen(8000,()=> console.log(`Server started at port ${PORT}`));
