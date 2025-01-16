const cards = await fetch("http://localhost:5678/api/works").then(cards => cards.json());
const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json());



function generateCards(cards){
    for(let i=0; i<cards.length; i++){

        const card = cards[i];

        const divGallery = document.querySelector(".gallery");

        const cardElement = document.createElement("figure");

        const imageElement = document.createElement("img");
        imageElement.src = card.imageUrl;

        const titleElement = document.createElement("figcaption");
        titleElement.innerText = card.title;

        divGallery.appendChild(cardElement);
        cardElement.appendChild(imageElement);
        cardElement.appendChild(titleElement);

    }
};



function generateFilters(menu){

    const allButton = document.createElement("button");
    const filters = document.querySelector(".filters");
    allButton.setAttribute("id", "all");
    allButton.innerText = "Tous";
    filters.appendChild(allButton);

    for(let i=0; i<menu.length; i++){
    const button = document.createElement("button");
    const filters = document.querySelector(".filters");
    button.setAttribute("id", [i]);
    button.innerText = menu[i];
    filters.appendChild(button);
    };
};


const mapCategory = cards.map(card => card.category.name);
const setMapCategory = [...new Set(mapCategory)];
console.log(setMapCategory);


generateCards(cards);
generateFilters(setMapCategory);

const objectButton = document.getElementById(0);
objectButton.addEventListener("click", function(){
    const cardsObject = cards.filter(function (card){
        return card.categoryId === 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateCards(cardsObject);
});

const flatButton = document.getElementById(1);
flatButton.addEventListener("click", function(){
    const cardsFlat = cards.filter(function (card){
        return card.categoryId === 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateCards(cardsFlat);
});

const hotelButton = document.getElementById(2);
hotelButton.addEventListener("click", function(){
    const cardsHotel = cards.filter(function (card){
        return card.categoryId === 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateCards(cardsHotel);
});

const tousButton = document.getElementById("all");
tousButton.addEventListener("click", function(){
    document.querySelector(".gallery").innerHTML = "";
    generateCards(cards);
});
