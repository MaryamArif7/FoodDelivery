import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://mary:mary7@foodrush.zk9bxux.mongodb.net/?retryWrites=true&w=majority&appName=FoodRush',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}

)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));