import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const data = req.body;

    const newTodo = await Todo.create({
      title:data.title,
      completed:data.completed,
      priority:data.priority,
      tags:data.tags,
      dueDate:data.dueDate,
    })

    return res.status(201).json(newTodo)
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    const {completed,priority,search,sort} = req.query;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
   console.log(priority)
   const filters = {}

   if(completed !== undefined) {
     filters.completed = completed === "true";
   }
   if(priority){
    filters.priority = priority
   }
   if(search){
    filters.title = {$regex:search,$options:"i"}
   }
    
    const total =  await Todo.countDocuments(filters);
    const pages = Math.ceil(total/limit);
    const skip = ((page-1) * limit)
    const data = await Todo.find(filters)
                .sort({createdAt: sort === "desc"? 1:-1})
                .skip(skip)
                .limit(limit); //Find is used to list all data persent in DB

    return res.json({
      data:data,
      meta:{total,page,limit,pages}
    })
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const id = req.params.id;
    const user = await Todo.findById(id);
    if(!user){
      return res.status(404).json({
        error:{
          message:"Not found"
        }
      })
    }

    return res.json(user)
    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await Todo.findByIdAndUpdate(id,{$set:data},{new:true, runValidators:true});
    if(!user){
      return res.status(404).json({
        error:{
          message:"Not Found"
        }
      });
    }
    return res.json(user)
    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const id = req.params.id;
    const user = await Todo.findById(id);
    if(!user){
      return res.status(404).json({
        error:{
          message:"Not found"
        }
      })
    }
    const completed = !user.completed;
    user.completed = completed;
    await user.save();

    return res.json(user)
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const id = req.params.id;
    const user = await Todo.findByIdAndDelete(id);
    if(!user){
      return res.status(404).json({
        error:{
          message:"Not found"
        }
      })
    }
    return res.status(204).end();   
  } catch (error) {
    next(error);
  }
}
