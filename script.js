var app = new Vue({
  el: "#app",
  data: {
    page: "homePage",
    sortCriteria: "name",
    sortOrder: "ascending",
    searchQuery: "",
    showCheckOut: true,
    showModal: false,
    lessons: [],
    submitted: false,
    filteredLessons: [],
    order: {
      firstName: "",
      lastName: "",
      email: "",
      state: "",
      phoneNumber: "",
    },
    states: {
      AD: "Abu Dhabi",
      DU: "Dubai",
      SH: "Sharjah",
      AJ: "Ajman",
      UQ: "Umm Al-Quwain",
      FJ: "Fujairah",
      RK: "Ras Al Khaimah",
    },
    cart: [],
    showProduct: false, // Variable to track cart visibility
  },
  methods: {
    async fetchLessons() {
      try {
        const response = await fetch(
          "https://skillora-server.onrender.com/api/lessons"
        );
        if (!response.ok) throw new Error("Failed to fetch lessons");
        const data = await response.json();
        this.lessons = data;
        this.filteredLessons = data;
      } catch (err) {
        console.error("Failed to fetch lessons", err.message);
      }
    },
    addToCart(lessonId) {
      const lesson = this.lessons.find((lesson) => lesson._id === lessonId);
      if (lesson && lesson.spaces > 0) {
        const cartItem = { ...lesson };
        cartItem.spaces--;
        this.cart.push(cartItem);
        lesson.spaces--;
      }
    },
    async updateLessonSpaces(id, spaces) {
      try {
        const response = await fetch(
          `https://skillora-server.onrender.com/api/lessons/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spaces }),
          }
        );
        if (!response.ok) throw new Error("Failed to update spaces");
      } catch (err) {
        console.error(err.message);
      }
    },
    showCartItems() {
      if (this.cart.length > 0) {
        this.showProduct = !this.showProduct;
        if (this.showProduct) {
          this.page = 'productPage';  // Navigate to product page when cart is shown
        } else {
          this.page = 'homePage';  // Go back to homepage when cart is hidden
        }
      } else {
        alert("No items in cart");
      }
    },
    removeItem(index) {
      const removedItem = this.cart[index];
      const originalLesson = this.lessons.find(
        (lesson) => lesson._id === removedItem._id
      );
      if (originalLesson) {
        originalLesson.spaces++;
      }
      this.updateLessonSpaces(originalLesson._id, originalLesson.spaces);
      this.cart.splice(index, 1);
    },
    sortLessons() {
      const modifier = this.sortOrder === "ascending" ? 1 : -1;
      this.filteredLessons.sort((a, b) => {
        if (this.sortCriteria === "name") {
          return modifier * (a.subject > b.subject ? 1 : -1);
        } else if (this.sortCriteria === "location") {
          return modifier * (a.location > b.location ? 1 : -1);
        } else if (this.sortCriteria === "space") {
          return modifier * (a.spaces - b.spaces);
        } else if (this.sortCriteria === "price") {
          return modifier * (a.price - b.price);
        } else if (this.sortCriteria === "rating") {
          return modifier * (a.ratings - b.ratings);
        }
      });
    },
    navigatePages(page) {
      if (this.page === "homePage") {
        this.page = "productPage";
      } else if (this.page === "productPage") {
        this.page = "homePage";
      } else if (this.page === "checkOutPage") {
        this.page = "productPage";
      }
    },
    async handleSubmit() {
      try {
        const response = await fetch(
          "https://skillora-server.onrender.com/api/lessons/order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...this.order,
              cart: this.cart.map((lesson) => ({
                id: lesson._id,
                subject: lesson.subject,
                price: lesson.price,
                location: lesson.location,
              })),
            }),
          }
        );

        if (!response.ok) throw new Error("Order submission failed");

        await Promise.all(
          this.cart.map((lesson) =>
            fetch(
              `https://skillora-server.onrender.com/api/lessons/${lesson._id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spaces: lesson.spaces }),
              }
            )
          )
        );
        this.submitted = true;
        this.fetchLessons();
        setTimeout(() => {
          this.order = { firstName: "", lastName: "", email: "", state: "", phoneNumber: "" };
          this.cart = [];
        }, 100000);
        this.showModal = true;
      } catch (err) {
        console.error("Failed to submit order", err.message);
      }
    },
    doneWithOrder() {
      this.page = "homePage";
      this.showModal = false;
      this.submitted = false;
    },
    async searchLessons() {
      const query = this.searchQuery.trim();
      if (query === "") {
        this.filteredLessons = [...this.lessons];
        return;
      }
      try {
        const response = await fetch(
          `https://skillora-server.onrender.com/api/search?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        this.filteredLessons = data;
      } catch (err) {
        console.error("Failed to search lessons", err.message);
      }
    },
  },
  watch: {
    isCartEmpty(newValue) {
      if (newValue) {
        this.page = "homePage";
      }
    },
  },
  computed: {
    countCartItems() {
      return this.cart.length || "";
    },
    isCartEmpty() {
      return this.cart.length === 0;
    },
  },
  mounted() {
    this.fetchLessons().then(() => {
      this.filteredLessons = [...this.lessons];
    });
  },
});
