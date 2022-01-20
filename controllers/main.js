
const CustomAPIError=require('../errors/custom-error')
const jwt=require('jsonwebtoken')
const User=require('../models/User')
const Post=require('../models/Post')
const Comment=require('../models/comment')

const login=async (req,res)=>{
     
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(400).send("All input is required");
          return
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user &&  (user.password==password )) {
          // Create token
          const token = jwt.sign(
            {  email },
            process.env.JWT_SECRET,
            {
              expiresIn: "8d",
            }
          );
    
          // save user token
          user.token = token;
          res.status(200).json({"token":"Bearer "+user.token});
          return
        }
        res.status(400).send("Invalid Credentials");
        return
      } catch (err) {
        console.log(err);
      }
     
}

const register=async (req,res)=>{
    try {
        // Get user input
        const {  email, password } = req.body;
    
        // Validate user input
        if (!(email && password )) {
          res.status(400).send("All input is required");
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
         // Create token
         const token = jwt.sign(
            {  email },
            process.env.JWT_SECRET,
            {
              expiresIn: "8d",
            }
          );
        
        // Create user in our database
        const user = await User.create({
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: password,
          token:token
        });
    
      
        // save user token
        user.token = token;
    
        // return new user
        res.status(201).json({"token":"Bearer "+user.token});
      } catch (err) {
        console.log(err);
      }

}

const follow=async (req,res)=>{

       try {
          
        const usertofollow=await User.findOne({email:req.params.id});
        const currentUser=await User.findOne({email:req.user});
        if(!usertofollow)
        {
            res.status(400).json("id does not exist")
            return
        }
        console.log(req.user)
        console.log(req.params.id)
      
        await usertofollow.updateOne({ $push: { followers: req.user} });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        
        res.status(200).json("user has been followed");
        
    
        return
       } catch (error) {
           console.log(error)
       }
       


     
}

const unfollow=async (req,res)=>{

    try {
       
     const usertounfollow=await User.findOne({email:req.params.id});
     const currentUser=await User.findOne({email:req.user});
     if(!usertounfollow)
     {
         res.status(400).json("id does not exist")
         return
     }
     console.log(req.user)
     console.log(req.params.id)
   
     await usertounfollow.updateOne({ $pull: { followers: req.user} });
     await currentUser.updateOne({ $pull: { followings: req.params.id } });
     
     res.status(200).json("user has been unfollowed");
     
 
     return
    } catch (error) {
        console.log(error)
    }
    


  
}

const getuser=async (req,res)=>{
    try {
        
        const userinfo=await User.findOne({email:req.user});
        
        if(!userinfo)
        {
            res.status(400).json("id does not exist")
            return
        }
        
      
       const {email,followers,followings}=userinfo;
        res.status(200).json({"username":email,
                               "Followers":followers,
                             "Following":followings  })
        

    } catch (error) {
        console.log(error)
        
    }
}
const createpost=async (req,res)=>{
    
    try {
        const {data,Title}=req.body;
        
        
         const newpost=await Post.create({
            userId:req.user,
            Title:Title,
             desc:data,
         })
       if(!newpost)
       {
        res.status(400).json("error in creating post")
            return   
       }
      

       
       res.status(200).json({"userID":newpost.userId,
       "Title":newpost.Title,
       "description":newpost.desc,"created at":newpost.createdAt});
       return;

    } catch (error) {
        console.log(error)
    }
}
const likepost=async (req,res)=>{
    try {
         
      const posttolike=await Post.findById(req.params.id);
      if(!posttolike)
      {
        res.status(400).json("The post does not exist")
        return
      }
      if (!posttolike.likes.includes(req.user)) {
        await posttolike.updateOne({ $push: { likes: req.user } });
     

        res.status(200).json("The post has been liked");
      } else {
      
        res.status(200).json("The post is already liked");
      }
        
        
    } catch (error) {
        console.log(error)
    }
}
const unlikepost=async (req,res)=>{
  try {
         
    const posttounlike=await Post.findById(req.params.id);
    if(!posttounlike)
    {
      res.status(400).json("The post does not exist")
      return
    }
    if (posttounlike.likes.includes(req.user)) {
      await posttounlike.updateOne({ $pull: { likes: req.user } });
   

      res.status(200).json("The post has been unliked");
    } else {
    
      res.status(200).json("The post is already unliked");
    }
      
      
  } catch (error) {
      console.log(error)
  }
}

const deletepost=async (req,res)=>{
  try {
    
    const posttodel=await Post.findById(req.params.id);
      if(!posttodel)
      {
        res.status(400).json("The post does not exist")
        return
      }
      await Post.findByIdAndDelete(req.params.id);
    
      res.status(200).json("The post has been deleted");
      return

  } catch (error) {
    console.log(error)
  }
}

const comment=async (req,res)=>{
  try {
    const posttocomment=await Post.findById(req.params.id);
    if(!posttocomment)
    {
      res.status(400).json("The post does not exist")
      return
    }
    const {comment}=req.body
    const newcomment=await Comment.create({
      userId:req.user,
      desc:comment,
      postId:req.params.id, 
    });
    if(!newcomment)
    {
      res.status(400).json("error in posting comment");
    return
    }
  

    res.status(200).json(newcomment._id);
    return

  } catch (error) {
    console.log(error)
  }
}
const getpost=async (req,res)=>{
  try {
    const post=await Post.findById(req.params.id)
    if(!post)
    {
      res.status(400).json("The post does not exist")
      return
    } 
    var postresult={
      "_id":post._id,
      "user id":post.userId,
      "title":post.Title,
      "desc":post.desc,
      "createdAt":post.createdAt,
      "likes":post.likes.length

    }
     

     const comments=await Comment.find({postId:req.params.id}).select('userId desc')
    
     res.status(200).json({"POST":postresult,
                            "COMMENTS":comments });
    return
     
  } catch (error) {
    console.log(error)
  }
}

const getallposts=async (req,res)=>{
  try {

    var posts=await Post.find({userId:req.user}).sort({ createdAt: 'desc'});
    var comments=await Comment.find().sort({ createdAt: 'desc'});
    var final=[]
    for(let i=0;i<posts.length;i++)
    {
     // console.log(posts[i]);
          var tmp={
            "id":posts[i]._id,
            "title":posts[i].Title,
            "desc":posts[i].desc,
            "createdAt":posts[i].createdAt,
            "likes":posts[i].likes.length

          }
  

      final.push("post:")
      
      final.push(tmp);
      final.push("comments:")
      for(let j=0;j<comments.length;j++)
      {
        if(comments[j].postId==posts[i]._id)
        {  
          var tmp2={
            "id":comments[j].userId,
            "desc":comments[j].desc,
          }

          final.push(tmp2);
        }

      }


    }

    if(!posts)
    {
      res.status(400).json("posts does not exist")
      return
    } 
     
    
     res.status(200).json(final);
    return
     
  } catch (error) {
    console.log(error)
  }
}

module.exports={login,register,follow,unfollow,getuser,createpost,likepost,unlikepost,deletepost,comment,getpost,getallposts}









