const db = require('../models');
const blog = db.Blog;
const like = db.Like;
const kategori = db.Category;

const {Op, Sequelize} = require('sequelize')

module.exports = {

allBlog: async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;
    const total = await blog.count();

    const judul = req.query.judul;
    const condition = {};

    if (judul) {
      condition.title = { [Op.like]: `%${judul}%` };
    }
    const kategori = req.query.kategori;
    if (kategori) {
      condition.CategoryId = { [Op.like]: `%${kategori}%` };
    }

    const sortBy = req.query.sortBy || "createdAt";
    const orderBy = req.query.orderBy || "DESC";
    let order = [];
    if (sortBy === "Total_like" || sortBy === "createdAt") {
      order.push([sortBy, orderBy]);
    } else {
      order.push(["createdAt", "DESC"]); // Default semisal sort/order gagal
    }

    const result = await blog.findAll({
      attributes: [
        "id",
        "title",
        "keyword",
        "imageURL",
        "content",
        "videoURL",
        "country",
        "AccountId",
        "CategoryId",
        "createdAt",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM LIKES WHERE LIKES.BlogId = Blog.id)"
          ),
          "Total_like",
        ],
      ],
      limit,
      offset: offset,
      where: condition,
      order,
    });
    res.status(200).send({
      totalpage: Math.ceil(total / limit),
      currentpage: page,
      total_blog: total,
      result,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
},

blogById: async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;
    
    const blogId = req.body.id; 
    const total = await blog.count({
      where: { id : blogId }
    });

    const result = await blog.findOne({
      where: {
        id: blogId,
      },
      limit,
      offset: offset,
      order: [["createdAt", "DESC"]]
    });

    res.status(200).send({
      totalpage: Math.ceil(total / limit),
      currentpage: page,
      total_blog: total,
      result,
      status: true
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
},

  createBlog: async (req, res) => {
    try {
      const { title, keyword, content, videoURL, country, category } = req.body;
      const imageURL = req.file.filename;
      
      const catLike = await kategori.findOne({
        where: {
            category: {
                [Op.like]: category 
            }
        }
    })
    if (!catLike) {
      return res.status(400).send({ message: 'Category not found' }) 
    };

      const result = await blog.create({
        title,
        keyword,
        imageURL,
        content,
        videoURL,
        country,
        AccountId: req.user.id,
        CategoryId: catLike.id
      });
      
      res.status(200).send({
        msg: "Your blog has been created!",
        status: true,
        result
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  listCategory: async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const offset = (page - 1) * limit;
      const total = await kategori.count();
  
      const result = await kategori.findAll({
        attributes: [
          "id",
          "category"
        ],
        limit,
        offset: offset,
      });
      res.status(200).send({
        totalpage: Math.ceil(total / limit),
        currentpage: page,
        all_category: total,
        result,
        status: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

likeBlog : async(req, res) => {
  try {
      const {BlogId} = req.body;
      const AccountId = req.user.id
      
      const checkLike = await like.findOne({
        where: {BlogId, AccountId}
      })

      if (checkLike) {
        throw{message : "You already liked blog"}
      }
      
      const result = await like.create ({
          AccountId,
          BlogId,
          isLike : true,
      })
      res.status(200).send({
          msg: 'Like it!',
          result
      })
  } catch (err) {
      console.log(err);
      res.status(400).send(err)
  }
},

getUserBlog: async(req,res)=>{
  try {
    const page = +req.query.page || 1
    const limit = +req.query.limit|| 10;
    const offset = (page - 1) * limit;
    const AccountId = req.user.id
    const total = await blog.count({
      where : {AccountId : AccountId}
    })

    
    const result = await blog.findAll({attributes:[
          "title",
          "keyword",
          "imageURL",
          "content",
          "videoURL",
          "country",
          "AccountId",
          "CategoryId",
          "createdAt"
      ], 
      limit,
      offset:offset,
      where : {
        AccountId: AccountId
      },
      order: [[
        "createdAt","DESC"
      ]]
    })
    
      res.status(200).send({
          totalpage: Math.ceil(total/limit),
          currentpage: page,
          total_blog: total,
          result, 
          status:true
      }
  )
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
},

getLikeBlog: async(req,res)=>{
  try {
    const page = +req.query.page || 1
    const limit = +req.query.limit|| 10;
    const offset = (page - 1) * limit;
    const AccountId = req.user.id

    const total = await like.count({
      where : {AccountId : AccountId}
    })
    const result = await like.findAll({include: [{
      model: blog 
    }
  ],attributes:[
    "BlogId",
    [Sequelize.literal(
      "(SELECT COUNT(*) FROM likes WHERE likes.BlogId = Blog.id)"), "Total_like" ]],
      limit,
      offset:offset,
      where : {
        AccountId: AccountId
      },
      order: [[
        "createdAt","DESC"
      ]]
    })
    console.log("result",result);
    
    res.status(200).send({
          totalpage: Math.ceil(total/limit),
          currentpage: page,
          liked_blogs: total,
          result, 
          status:true
      }
  )
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
},

deleteBlog : async(req, res) => {
  try {
      const id = req.body.id;
      const result = await blog.destroy ({
        where: {id: id}
      })
      res.status(200).send({
          status: true,
          msg: 'Success deleted blog!',
          result
      })
  } catch (err) {
      console.log(err);
      res.status(400).send(err)
  }
},


}; //---End
