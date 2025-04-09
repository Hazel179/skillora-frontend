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
  },
  methods: {
    // Fetch lessons from the server
    async fetchLessons() {
      try {
        const response = await fetch("https://skillora-server.onrender.com/api/lessons");
        if (!response.ok) throw new Error("Failed to fetch lessons");
        const data = await response.json();
        this.lessons = data;
        this.filteredLessons = data;
      } catch (err) {
        console.error("Failed to fetch lessons", err.message);
      }
    },

    // Sorting function
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

    // Method to navigate pages
    navigatePages(page) {
      this.page = page;
    },

    // Add lesson to the cart
    addToCart(lessonId) {
      const lesson = this.lessons.find((lesson) => lesson._id === lessonId);
      if (lesson && lesson.spaces > 0) {
        const cartItem = { ...lesson };
        cartItem.spaces--;
        this.cart.push(cartItem);
        lesson.spaces--;
      }
    },

    // Remove item from the cart
    removeItem(index) {
      const removedItem = this.cart[index];
      const originalLesson = this.lessons.find(
        (lesson) => lesson._id === removedItem._id
      );
      if (originalLesson) {
        originalLesson.spaces++;
      }
      this.cart.splice(index, 1);
    },

    // Submit order function
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

        // After order submission, update spaces in the database for each lesson
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
        this.fetchLessons();  // Refresh lessons after order submission

        // Reset form and cart after submission
        setTimeout(() => {
          this.order = { firstName: "", lastName: "", email: "", state: "", phoneNumber: "" };
          this.cart = [];
        }, 100000);

        this.showModal = true;
      } catch (err) {
        console.error("Failed to submit order", err.message);
      }
    },

    // Handle modal close
    doneWithOrder() {
      this.page = "homePage";
      this.showModal = false;
      this.submitted = false;
    },

    // Search function
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

