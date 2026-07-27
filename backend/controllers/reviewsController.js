import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  try {
    const { slug } = req.query;
    let query = {};
    if (slug) {
      query.slug = slug;
    }
    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (error) {
    console.error("Error in getReviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { name, rating, text, slug, role } = req.body;

    if (!name || !rating || !text) {
      return res.status(400).json({ error: "Name, rating, and review text are required." });
    }

    const newReviewData = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      role: role ? role.trim() : "Verified Customer",
      rating: parseInt(rating, 10),
      text: text.trim(),
      slug: slug ? slug.trim() : "general",
      date: new Date().toISOString(),
    };

    const newReview = await Review.create(newReviewData);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};
