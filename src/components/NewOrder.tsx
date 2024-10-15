import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, X, Upload } from 'lucide-react';

const schema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  orderDetails: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be non-negative'),
    images: z.array(z.instanceof(File)).min(1, 'At least one image is required'),
  })).min(1, 'At least one order detail is required'),
});

type NewOrderForm = z.infer<typeof schema>;

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm<NewOrderForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderDetails: [{ description: '', quantity: 1, unitPrice: 0, images: [] }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orderDetails',
  });

  const [previewImages, setPreviewImages] = useState<{ [key: number]: string[] }>({});

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviewImages = [...(previewImages[index] || [])];
      Array.from(files).forEach((file) => {
        newPreviewImages.push(URL.createObjectURL(file));
      });
      setPreviewImages({ ...previewImages, [index]: newPreviewImages });
    }
  };

  const removeImage = (index: number, imageIndex: number) => {
    const newPreviewImages = [...previewImages[index]];
    newPreviewImages.splice(imageIndex, 1);
    setPreviewImages({ ...previewImages, [index]: newPreviewImages });
  };

  const onSubmit = (data: NewOrderForm) => {
    console.log(data);
    // Here you would typically send the data to your backend
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Create New Order</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Customer Name</label>
                  <input
                    type="text"
                    {...register('customerName')}
                    className="px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="Customer name"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Phone Number</label>
                  <input
                    type="text"
                    {...register('phoneNumber')}
                    className="px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="Phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Email (Optional)</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="Email address"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Address</label>
                  <textarea
                    {...register('address')}
                    className="px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="Customer address"
                    rows={3}
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
              </div>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Order Details</label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-md mb-4">
                      <div className="flex flex-col mb-2">
                        <label className="leading-loose">Description</label>
                        <textarea
                          {...register(`orderDetails.${index}.description` as const)}
                          className="px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          placeholder="Item description"
                          rows={3}
                        ></textarea>
                        {errors.orderDetails?.[index]?.description && (
                          <p className="text-red-500 text-xs mt-1">{errors.orderDetails[index]?.description?.message}</p>
                        )}
                      </div>
                      <div className="flex space-x-4 mb-2">
                        <div className="flex flex-col flex-1">
                          <label className="leading-loose">Quantity</label>
                          <input
                            type="number"
                            {...register(`orderDetails.${index}.quantity` as const, { valueAsNumber: true })}
                            className="px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                            placeholder="Quantity"
                          />
                          {errors.orderDetails?.[index]?.quantity && (
                            <p className="text-red-500 text-xs mt-1">{errors.orderDetails[index]?.quantity?.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="leading-loose">Unit Price</label>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`orderDetails.${index}.unitPrice` as const, { valueAsNumber: true })}
                            className="px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                            placeholder="Unit price"
                          />
                          {errors.orderDetails?.[index]?.unitPrice && (
                            <p className="text-red-500 text-xs mt-1">{errors.orderDetails[index]?.unitPrice?.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col mb-2">
                        <label className="leading-loose">Images</label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col w-full h-24 border-2 border-dashed hover:bg-gray-100 hover:border-indigo-300 group">
                            <div className="flex flex-col items-center justify-center pt-4">
                              <Upload className="w-8 h-8 text-indigo-400 group-hover:text-indigo-600" />
                              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-indigo-600">
                                Upload images
                              </p>
                            </div>
                            <input
                              type="file"
                              multiple
                              className="opacity-0"
                              {...register(`orderDetails.${index}.images` as const)}
                              onChange={(e) => handleImageChange(index, e)}
                            />
                          </label>
                        </div>
                        {errors.orderDetails?.[index]?.images && (
                          <p className="text-red-500 text-xs mt-1">{errors.orderDetails[index]?.images?.message}</p>
                        )}
                        {previewImages[index] && (
                          <div className="mt-2 flex flex-wrap">
                            {previewImages[index].map((img, imgIndex) => (
                              <div key={imgIndex} className="relative m-1">
                                <img src={img} alt="preview" className="h-16 w-16 object-cover rounded" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index, imgIndex)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-2 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <X className="h-4 w-4 mr-1" /> Remove Item
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0, images: [] })}
                    className="mt-2 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Item
                  </button>
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                >
                  <X className="w-5 h-5 mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;