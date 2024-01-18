'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { z } from 'zod'
import { FormDataSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Image from 'next/image'
import { Combobox, RadioGroup } from '@headlessui/react'
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/16/solid'

type Inputs = z.infer<typeof FormDataSchema>

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ')
}

const steps = [
  {
    id: 'Step 1',
    name: 'Basic information',
    fields: ['category', 'tier']
  },
  {
    id: 'Step 2',
    name: 'Information',
    fields: [
      'title',
      'description',
      'location',
      'price',
      'usage',
      'condition',
      'fuelType',
      'gearType',
      'brand',
      'images'
    ]
  },
  { id: 'Step 3', name: 'Confirmation' },
  { id: 'Step 4', name: 'Congratulation' }
]

type Category = {
  label: string
  value: string
  // include other properties as needed
}

const categories: Category[] = [
  { label: 'Electronics & Gadgets', value: 'Electronics & Gadgets' },
  { label: 'Accessories & parts', value: 'Accessories & parts' },
  { label: 'Car', value: 'Car' },
  { label: 'Property', value: 'Property' },
  { label: 'Tourism', value: 'Tourism' },
  { label: 'Job', value: 'Job' }
]

const memoryOptions = [
  { name: '4 GB', inStock: true },
  { name: '8 GB', inStock: true },
  { name: '16 GB', inStock: true },
  { name: '32 GB', inStock: false }
]

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    label: '',
    value: ''
  })
  const delta = currentStep - previousStep

  const filteredPeople =
    query === ''
      ? categories
      : categories.filter(category => {
          return category.label.toLowerCase().includes(query.toLowerCase())
        })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    control,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

  let imageFile = watch('images')
  let imageURL = []

  for (const key in imageFile) {
    if (imageFile.hasOwnProperty(key)) {
      const url = URL.createObjectURL(imageFile[key])
      imageURL.push(url)
    }
  }

  const removeImage = (index: number) => {
    const newImageFile = [...imageFile]
    newImageFile.splice(index, 1)
    console.log(newImageFile)
    console.log(imageFile)

    setValue('images', newImageFile)
  }

  const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields

    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)()
      }
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  return (
    <section className=''>
      {/* steps */}
      <nav aria-label='Progress'>
        <ol role='list' className='space-y-4 md:flex md:space-y-0'>
          {steps.map((step, index) => (
            <li key={step.name} className='md:flex-1'>
              {currentStep > index ? (
                <div className='group  w-full border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-b-4 md:border-l-0 md:pb-0 md:pl-0 md:pt-4'>
                  <p className=' text-center text-sm font-medium'>
                    {step.name}
                  </p>
                </div>
              ) : currentStep === index ? (
                <div
                  className=' w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-b-4 md:border-l-0 md:pb-0 md:pl-0 md:pt-4'
                  aria-current='step'
                >
                  <p className='text-center text-sm font-medium'>{step.name}</p>
                </div>
              ) : (
                <div className='group w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-b-4 md:border-l-0 md:pb-0 md:pl-0 md:pt-4'>
                  <p className='text-center text-sm font-medium'>{step.name}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className='py-12' onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='mt-10'>
              <div className='sm:col-span-3'>
                <Combobox
                  as='div'
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                >
                  <Combobox.Label className='block text-sm font-medium leading-6 text-gray-900'>
                    Category
                  </Combobox.Label>
                  <div className='relative mt-2'>
                    <Controller
                      name='category'
                      control={control}
                      render={({ field }) => (
                        <Combobox.Input
                          {...register('category')}
                          className='w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          // onChange={event => setQuery(event.target.value)}
                          onChange={event => {
                            field.onChange(event)
                            setQuery(event.target.value)
                          }}
                          // value={selectedCategory?.label}
                          displayValue={(item: Category) => item?.label}
                        />
                      )}
                    />
                    <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                      <ChevronDownIcon className='h-4 w-4' />
                    </Combobox.Button>

                    {filteredPeople.length > 0 && (
                      <Combobox.Options className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                        {filteredPeople.map((category, index) => (
                          <Combobox.Option
                            key={index}
                            value={category}
                            className={({ active }) =>
                              classNames(
                                'relative cursor-default select-none py-2 pl-8 pr-4',
                                active
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-900'
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    'block truncate',
                                    selected && 'font-semibold'
                                  )}
                                >
                                  {category.label}
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                      active ? 'text-white' : 'text-indigo-600'
                                    )}
                                  >
                                    <CheckIcon
                                      className='h-5 w-5'
                                      aria-hidden='true'
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
                {errors.category?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.category.message}
                  </p>
                )}
              </div>

              {selectedCategory.label?.toLowerCase() === 'car' && (
                <>
                  <div className='mt-4 sm:col-span-3'>
                    <label>
                      {' '}
                      <Controller
                        control={control}
                        name='tier'
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <RadioGroup.Label>Packages</RadioGroup.Label>
                            <div className='mt-2 space-y-4'>
                              <RadioGroup.Option value='free'>
                                {({ checked }) => (
                                  <div
                                    className={`flex max-w-[170px] flex-col items-start justify-end rounded-lg border-2 bg-stone-50 py-7 pl-6 pr-4 text-white hover:border-blue-700 ${checked ? 'ring-1 ring-sky-600 ring-offset-2' : 'text-gray-900'}`}
                                  >
                                    <Image
                                      src='/free.png'
                                      width={30}
                                      height={30}
                                      loading='lazy'
                                      alt='Product Image'
                                    />
                                    <header className='self-stretch text-base font-medium text-black'>
                                      Free
                                    </header>
                                    <div
                                      className='self-stretch text-xs text-neutral-400'
                                      role='description'
                                      aria-label='Product Price'
                                    >
                                      Try free then go for packages
                                    </div>
                                  </div>
                                )}
                              </RadioGroup.Option>
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </label>
                  </div>
                  {errors.tier?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {
                        <span className='text-red-900'>
                          {errors.tier.message}
                        </span>
                      }
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='col-span-full'>
                <label
                  htmlFor='street'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Title
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='title'
                    {...register('title')}
                    autoComplete='street-address'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.title?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='col-span-full'>
                <label
                  htmlFor='street'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Brand
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='title'
                    {...register('brand')}
                    autoComplete='street-address'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.brand?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.brand.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='col-span-full'>
                <label
                  htmlFor='street'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Description
                </label>
                <div className='mt-2'>
                  <textarea
                    id='title'
                    {...register('description')}
                    autoComplete='street-address'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.description?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-2 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Location
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='city'
                    {...register('location')}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.location?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-2'>
                <label
                  htmlFor='state'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Price
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='state'
                    {...register('price')}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.price?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-2'>
                <label
                  htmlFor='zip'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Usage
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='zip'
                    {...register('usage')}
                    autoComplete='postal-code'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.usage?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.usage.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='sm:col-span-2 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Condition
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='city'
                    {...register('condition')}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.condition?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-2'>
                <label
                  htmlFor='state'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Fuel Type
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='state'
                    {...register('fuelType')}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.fuelType?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.fuelType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-2'>
                <label
                  htmlFor='zip'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Gear type
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='zip'
                    {...register('gearType')}
                    autoComplete='postal-code'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.gearType?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.gearType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='col-span-6 flex items-stretch gap-4 rounded-xl border-[1.5px] border-dashed border-yellow-500 bg-yellow-500 bg-opacity-0 py-6 pl-8 pr-6 max-md:flex-wrap max-md:px-5'>
                <Image
                  alt='Sticky image'
                  width={30}
                  height={30}
                  loading='lazy'
                  src='/paper-clip.png'
                  className='my-auto aspect-square w-6 max-w-full shrink-0 self-center overflow-hidden object-contain object-center'
                />
                <div className='my-auto shrink grow basis-auto self-center text-sm font-medium text-amber-500 max-md:max-w-full'>
                  <label htmlFor='file-input'>
                    Upload Image/ Videos/ Files
                  </label>
                  <input
                    id='file-input'
                    type='file'
                    accept='image/*'
                    aria-label='Input file'
                    className='hidden'
                    multiple
                    {...register('images')}
                  />
                </div>
                <label
                  htmlFor='file-input'
                  className='items-stretch justify-center whitespace-nowrap rounded-3xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-white'
                >
                  Select
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <>
            {imageURL.length > 0 && (
              <div className='mt-10 flex flex-wrap items-center justify-center gap-4 align-middle'>
                {imageURL.map((url: any, index: number) => (
                  <div key={index} className='relative'>
                    <Image
                      width={1200}
                      height={1200}
                      alt=''
                      src={url}
                      className='h-20 w-28 overflow-hidden rounded-md object-cover'
                    />
                    <button
                      type='button'
                      className='absolute -right-2 -top-2'
                      onClick={() => removeImage(index)}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='22'
                        height='23'
                        viewBox='0 0 22 23'
                        fill='none'
                      >
                        <g filter='url(#filter0_d_17_4609)'>
                          <circle cx='9' cy='8' r='7' fill='black' />
                        </g>
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M9 16C13.4183 16 17 12.4183 17 8C17 3.58172 13.4183 0 9 0C4.58172 0 1 3.58172 1 8C1 12.4183 4.58172 16 9 16ZM7.70711 5.29289C7.31658 4.90237 6.68342 4.90237 6.29289 5.29289C5.90237 5.68342 5.90237 6.31658 6.29289 6.70711L7.58579 8L6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L9 9.41421L10.2929 10.7071C10.6834 11.0976 11.3166 11.0976 11.7071 10.7071C12.0976 10.3166 12.0976 9.68342 11.7071 9.29289L10.4142 8L11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L9 6.58579L7.70711 5.29289Z'
                          fill='white'
                        />
                        <defs>
                          <filter
                            id='filter0_d_17_4609'
                            x='0'
                            y='1'
                            width='22'
                            height='22'
                            filterUnits='userSpaceOnUse'
                            color-interpolation-filters='sRGB'
                          >
                            <feFlood
                              flood-opacity='0'
                              result='BackgroundImageFix'
                            />
                            <feColorMatrix
                              in='SourceAlpha'
                              type='matrix'
                              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                              result='hardAlpha'
                            />
                            <feOffset dx='2' dy='4' />
                            <feGaussianBlur stdDeviation='2' />
                            <feComposite in2='hardAlpha' operator='out' />
                            <feColorMatrix
                              type='matrix'
                              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'
                            />
                            <feBlend
                              mode='normal'
                              in2='BackgroundImageFix'
                              result='effect1_dropShadow_17_4609'
                            />
                            <feBlend
                              mode='normal'
                              in='SourceGraphic'
                              in2='effect1_dropShadow_17_4609'
                              result='shape'
                            />
                          </filter>
                        </defs>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className='my-8 flex items-start justify-start gap-8'>
              <p className='font-bold'>
                Category:{' '}
                <span className='font-normal'>{watch('category')}</span>
              </p>
              <p className='font-bold'>
                Package:{' '}
                <span className='font-normal'>{watch('tier')} Package</span>
              </p>
            </div>
            <div className='flex items-center justify-between rounded-md bg-slate-50 px-4 py-4 align-middle'>
              <div className='flex items-center gap-4 align-middle'>
                <Image
                  src='/free.png'
                  width={30}
                  height={30}
                  loading='lazy'
                  alt='Product Image'
                />
                <h3 className='self-stretch text-base font-medium text-black'>
                  Free
                </h3>
              </div>
              <p>Free</p>
            </div>
            <div>
              <h2 className='mt-4 text-xl font-bold'>{watch('title')}</h2>
              <div className='mt-4 flex gap-4 align-top text-base font-bold'>
                Description:
                <p className='text-neutral-400'>{watch('description')}</p>
              </div>
            </div>
            <div>
              <h2 className='mt-4 text-xl font-bold'>{watch('title')}</h2>
              <div className='mt-4 flex gap-4 align-top text-base font-bold'>
                Location:
                <p className='text-neutral-400'>{watch('location')}</p>
              </div>
            </div>

            <div className='mt-20 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4 align-middle '>
              <div className='w-full p-4'>
                <div className='flex items-center justify-between align-middle'>
                  <h2 className='text-xl font-bold'>Payment</h2>
                  <p>{watch('tier')}</p>
                </div>
              </div>
            </div>
          </>
        )}
        {currentStep === 3 && (
          <div className='flex items-center justify-center text-center align-middle font-bold text-blue-600'>
            Thank you for using our service
          </div>
        )}
      </form>

      {/* Navigation */}
      <div className=' mt-52 pt-5'>
        <div className='flex items-end justify-between align-baseline'>
          <button
            type='button'
            onClick={prev}
            hidden={currentStep === 0 || currentStep === steps.length - 1}
            style={{
              background: 'linear-gradient(128deg, #41DDFF 0%, #7D2DFF 100%)'
            }}
            className='rounded-3xl px-10 py-3 text-sm font-medium text-white'
          >
            Previous
          </button>
          <p>
            {currentStep + 1} of {steps.length}
          </p>
          <button
            type='button'
            onClick={next}
            hidden={currentStep === steps.length - 1}
            style={{
              background: 'linear-gradient(128deg, #7D2DFF 0%, #41DDFF 100%)'
            }}
            className=' rounded-3xl px-10 py-3 text-sm font-medium text-white'
          >
            {currentStep === steps.length - 2 ? 'Proceed' : 'Next'}
          </button>
        </div>
      </div>
    </section>
  )
}
