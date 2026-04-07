import Joi from "joi";

export const createReportSchema = Joi.object({
  type: Joi.string()
  .valid("lost", "found")
  .insensitive()
  .required(),

  // type: Joi.string().lowercase().valid("lost", "found").required(),

  title: Joi.string().min(3).max(100).required(),

  description: Joi.string().allow("").optional(),

  category: Joi.string().allow("").optional(),

   city: Joi.string().allow("").optional(),

  address: Joi.string().allow("").optional(),

  // contact: Joi.string().allow("").optional(),
  


contact: Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().optional()
}).optional(),

  lng: Joi.number().optional().allow(null, "").empty("").default(null),
lat: Joi.number().optional().allow(null, "").empty("").default(null)
});