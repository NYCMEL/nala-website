window.MTK_REVIEWS_CONFIG = {
  component: "mtk-reviews",
  version: "1.0.1",
  labels: {
    title: "Please leave a review for <Locksmith-name>",
    subtitle: "Your rating helps future customers understand the business. The business owner cannot remove ratings from the average.",
    nameLabel: "Your name",
    namePlaceholder: "Your name",
    ratingLabel: "Your rating",
    reviewLabel: "Review",
    reviewPlaceholder: "Tell us about your experience",
    submitLabel: "Submit Review",
    requiredText: "Required",
    successText: "Thank you. Your review has been submitted.",
    errorText: "Please enter your name, choose a rating, and write a review."
  },
  defaults: {
    name: "",
    rating: 0,
    review: ""
  },
  icon: "rate_review",
  events: {
    publish: {
      ready: "mtk-reviews:ready",
      ratingChange: "mtk-reviews:rating-change",
      submit: "mtk-reviews:submit"
    },
    subscribe: [
      "4-mtk-reviews",
      "4-mtk-reviews:reset",
      "4-mtk-reviews:set-data"
    ]
  }
};
