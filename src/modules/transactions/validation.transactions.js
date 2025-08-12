import Joi from 'joi';

export const borrowSchema = Joi.object({
  bookId: Joi.string().required()
});
