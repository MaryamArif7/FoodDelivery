import { resolve } from "path";
const API_URL="http"
export function addToCart(item){
return new Promise(async(resolve)=>{
    const res=await fetch(`${API_URL}/cart`,{
        method:"POST",
        body:JSON.stringify(item),
        headers:{
            'content-type':'application/json'
        },
        
    });
    const data=await res.json();
    resolve({data});
})
}
export function  fetchItems(){
return new Promise(async(resolve)=>{
    const res=await fetch(`${API_URL}/cart`);
    const data=await res.json();
    resolve({data});
})
}
export function updateCart(update){
return new Promise(async(resolve)=>{
    const res=await fetch(`${API_URL}/cart`+update.id,{
        method: 'PATCH',
        body:JSON.stringify(update),
        headers:{
            'content-type':'application/json'
        },
        
    });
    const data=await res.json();
    resolve({data});
})
}
export function deleteFromCart(itemId){
return new Promise(async(resolve)=>{
    const res = await fetch(`${API_URL}/cart` + itemId, {
        method: 'DELETE',

        headers: {
            'content-type': 'application/json'
        },

    });
    const data=await res.json();
    resolve({data});
})
}
export function resetCart() {
  return new Promise(async (resolve) => {
    const res = await fetchItems();
    const items = res.data;
    for (let item of items) {
      await deleteFromCart(item.id);
    }
    resolve({ status: 'success' });
  });
}
