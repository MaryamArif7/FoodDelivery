export const Card=(name,description,price,image)=>{
    return(
        <div>
            <h2>{name}</h2>
            <p>{description}</p>
            <p>{price}</p>
            <img src={URL.createObjectURL(image)} alt={name} />
        </div>
    )
}