// DOM Content loaded function
/*    {
      "id": 1,
      "name": "Shoyu Ramen",
      "restaurant": "Nonono",
      "image": "./assets/ramen/shoyu.jpg",
      "rating": 7,
      "comment": "Delish. Can't go wrong with a classic!"
    },
*/

document.addEventListener("DOMContentLoaded", function () {
  //place all functions within this!
  console.log("The DOM is loaded!");

  let selected;

  function getRamen() {
    fetch("http://localhost:3000/ramens", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(),
    })
      .then((response) => response.json())
      .then((data) => {
        showRamen(data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }

  //render function
  function showRamen(data) {
    const ramenMenu = document.querySelector("#ramen-menu");

    for (const ramen of data) {
      const imageDiv = document.createElement("div");
      const image = document.createElement("img");

      image.src = `${ramen.image}`;
      image.alt = `${ramen.name}`;
      image.dataset.id = `${ramen.id}`;
      image.dataset.restaurant = `${ramen.restaurant}`;
      image.dataset.rating = `${ramen.rating}`;
      image.dataset.comment = `${ramen.comment}`;
      image.id = `menu_item_${ramen.id}`;

      // Add an event listener to each image for displaying details on click
      image.addEventListener("click", function () {
        selected = ramen.id;
        document.querySelector(".detail-image").src = this.src;
        document.querySelector(".name").textContent = this.alt;
        document.querySelector(".restaurant").textContent =
          this.dataset.restaurant;
        document.querySelector("#rating-display").textContent =
          this.dataset.rating;
        document.querySelector("#comment-display").textContent =
          this.dataset.comment;
      });

      imageDiv.appendChild(image);
      ramenMenu.appendChild(imageDiv);
    }
  }

  // TRY TO DELETE THE RAMEN!
  const deleteRamen = document.getElementById("delete-button");

  deleteRamen.addEventListener("click", function (event) {
    fetch(`http://localhost:3000/ramens/${selected}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success", data);
        //remove items from DOM
        document.getElementById("ramen_detail_wrapper").remove();
        document.getElementById(`menu_item_${selected}`).remove();
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // FORM FOR NEW RAMEN
  const form = document.getElementById("new-ramen");

  // Attach event listener to the form's submit event
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Gather form data
    const formData = {
      name: document.getElementById("new-name").value,
      restaurant: document.getElementById("new-restaurant").value,
      image: document.getElementById("new-image").value,
      rating: Number(document.getElementById("new-rating").value), // convert string to number
      comment: document.getElementById("new-comment").value,
    };

    // Send POST request using fetch to the json-server endpoint
    fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  getRamen();

  //EDIT FORM:
  const editForm = document.getElementById("edit-ramen");

  editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const editFormData = {
      rating: Number(document.getElementById("edit-rating").value), // convert string to number
      comment: document.getElementById("edit-comment").value,
    };

    fetch(`http://localhost:3000/ramens/${selected}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(editFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success", data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  });
});
