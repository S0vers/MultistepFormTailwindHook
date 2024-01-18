import { z } from 'zod'


export const FormDataSchema = z.object({
  category: z.string({
    required_error: "Please select a language.",
  }).min(1, "The category must be selected"),
  tier: z.enum(["free", "gold", "silver", "bronze"], {
    required_error: "Please select a Package",
  }),
  title: z.string().min(1, "The title must be more then 4 words long"),
  description: z
  .string()
  .min(1, "The description must be more then 100 words long"),
  location: z.string().min(1, 'Location is required'),
  price: z.string({required_error: "Give Price.",invalid_type_error:'Price should be number'}).min(1, 'Price is required').refine((val) => {
    return !isNaN(Number(val))
    }, {message: 'Price should be number'}),
    
    usage: z.string({required_error: "Give Usage.",invalid_type_error:'Usage should be number'}).min(1, 'Usage is required').refine((val) => {
    return !isNaN(Number(val))
    }, {message: 'Usage should be number'}),
  condition: z.string().min(1, 'Condition is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  gearType: z.string().min(1, 'Gear Type is required'),
  brand: z.string().min(1, 'Brand is required'),
  images: z.any()
})
