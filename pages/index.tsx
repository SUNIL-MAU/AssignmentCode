import { Input } from "@/components/ui/input"
import { useCallback, useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { updateFormData, saveFormData, deleteFormData } from '../store/formSlice';
import { RootState } from '../store';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { FormDataItem } from '@/lib/globla.types';

const tableHeadList = ['Name', 'Age', "Date of Birth", 'Phone Number', 'Address']

export default function Home() {
  const [editMode, setEditMode] = useState(false);
  const [lableText, setLableText] = useState("Register User");
  const dispatch = useDispatch();
  const formDataArray = useSelector((state: RootState) => state.form.formDataArray);
  const formSchema = z.object({
    name: z.string().nonempty("Name cannot be blank").max(20, "Name should be less than or equal to 20 characters").regex(/^[a-zA-Z ]*$/, "Name cannot contain numbers or special characters"),
    dob: z.string().nonempty("Date of birth cannot be blank").max(Date.now(), "Date of birth cannot be greater than today's date"),
    phoneNumber: z.string().nonempty("Phone number cannot be blank").regex(/^[0-9]*$/, "Phone number cannot contain letters").min(8, "Phone number should be at least 8 digits").max(10, "Phone number should be at most 10 digits"),
    address: z.array(
      z.object({
        value: z.string().nonempty("Address cannot be blank"),
      })
    ),
    password: z
      .string(),
    confirmPassword: z.string(),
    age: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string"
    })
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: Date.now(),
      name: '',
      age: '',
      dob: '',
      phoneNumber: '',
      address: [{ value: "" }],
      password: '',
      confirmPassword: '',
    }
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = form
  const { fields, append, remove } = useFieldArray({
    name: 'address',
    control
  })


  const submitHandler: SubmitHandler<FormDataItem> = useCallback((data) => {
    const id = Date.now()
    const inputData: FormDataItem = {
      id,
      ...data
    };
    if (editMode) {
      dispatch(updateFormData({ ...data }));
      setEditMode(false);
      setLableText('Register User')
    } else {
      dispatch(saveFormData(inputData));

    }
    reset()
  }, [editMode, dispatch])

  const handleEditClick = useCallback((formData: FormDataItem) => {
    setLableText("Update User");
    setValue('id', formData.id)
    setValue('address', formData.address)
    setValue('name', formData.name)
    setValue('age', formData.age.toString())
    setValue('phoneNumber', formData.phoneNumber.toString())
    setValue('password', formData.password)
    setValue('confirmPassword', formData.confirmPassword)
    setValue('dob', formData.dob)
    setEditMode(true);
  }, [editMode, lableText])


  return (
    <div className='pt-6 pb-8 px-8 '>
      <form className="shadow-md bg-gray-300 rounded px-6 pt-4 pb-6" onSubmit={handleSubmit(submitHandler as any)} >
        <h1 className='text-center mb-2 text-5xl font-thin py-6'>Registration Form</h1>
        <div className='grid grid-cols-12 gap-4'>
          <Input
            label="Name*"
            message={errors.name?.message}
            {...register('name')}
            placeholder="Name" />
          <Input
            label="Age"
            type='number'
            {...register('age')}
            placeholder="Age" />
          <Input
            label="Date of birth*"
            message={errors.dob?.message}
            type="date"
            {...register('dob')}
            placeholder="Date of Birth" />
          <Input
            label="Phone Number*"
            message={errors.phoneNumber?.message}
            {...register('phoneNumber')}
            placeholder="Phone Number" />
          <Input
            label="Password"
            {...register('password')}
            message={errors.password?.message}
            type="password"
            placeholder="Password" />
          <Input
            label="Confirm Password"
            {...register('confirmPassword')}
            message={errors.confirmPassword?.message}
            type="password"
            placeholder="Confirm Password" />

          <div className='col-span-12'>
            {fields.map((field, index) => {
              return (
                <div key={field.id} className='col-span-12 relative'>
                  <Input
                    label={`Address-${index + 1}`}
                    className='flex-1'
                    {...register(`address.${index}.value` as const)}
                    placeholder="Address" />
                  {index > 0 ? (
                    <button className='absolute text-red-600 right-0 top-0' onClick={() => remove(index)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z" clipRule="evenodd" />
                    </svg>
                    </button>

                  ) : null}
                </div>

              )
            })}
            <div className='w-full flex justify-center' onClick={() => append({ value: "" })}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-600 cursor-pointer">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <button className="bg-gray-600 mt-4 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline" type="submit">
          {lableText}
        </button>
      </form>
      <div className="container bg-gray-300 shadow-md overflow-auto rounded mt-6 pt-4 pb-6 mx-auto py-8">
        {formDataArray.length ? (
          <>
            <h1 className='text-center mb-4 text-5xl font-thin '>User Info</h1>
            <table className="w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-100 border-b">
                  {tableHeadList.map((head, index) => <th key={index} className="px-6 py-4 text-left font-bold text-gray-700">{head}</th>
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formDataArray.map((formData: FormDataItem) => (
                  <tr key={formData.id} className="bg-gray-100 border-b">
                    <td className="px-6 py-4 text-left text-gray-700">{formData.name}</td>
                    <td className="px-6 py-4 text-left text-gray-700">{formData.age}</td>
                    <td className="px-6 py-4 text-left text-gray-700">{formData.dob}</td>
                    <td className="px-6 py-4 text-left text-gray-700">{formData.phoneNumber}</td>
                    <td className="px-6 py-4 text-left text-gray-700">
                      {formData.address.map((value, index) => (`${index !== 0 ? ', ' : ''}${value.value}`))}
                    </td>
                    <td className='flex px-6 py-4 gap-3 items-center justify-center h-full'>
                      <button className='cursor-pointer h-full' onClick={() => handleEditClick(formData)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-400">
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                          <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                        </svg>
                      </button>
                      <button className='cursor-pointer h-full' onClick={() => dispatch(deleteFormData(formData.id))}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
                          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (<div className=' py-4  text-gray-700 w-full text-center'>No data found</div>)}

      </div>
    </div>
  )
}
