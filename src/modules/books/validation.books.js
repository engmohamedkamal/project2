import Joi from 'joi';

export const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  publishedYear: Joi.number().integer().required(),
  availableCopies: Joi.number().integer().min(0).default(1)
});
