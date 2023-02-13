import React from "react";
import { Button, Checkbox, Flex, FormControl, FormLabel, Icon, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { RiEyeCloseLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState } from "react";


const UserModal = (props) => {

    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const [show, setShow] = useState(false);
    const [isValidEmail, SetIsValidEmail] = useState(false)
    const [isValidName, setIsValidName] = useState(false)
    const [isvalidCountry, setIsValidCountry] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [country, setCountry] = useState("")

    const changeName = (e) =>{
        if(e.target.value){
            setName(e.target.value)
            setIsValidName(true)
        }
    }
    const changeCountry = (e) =>{
        if(e.target.value){
            setCountry(e.target.value)
            setIsValidCountry(true)
        }
    }
    const changeEmail = (e) =>{
        if(e.target.value){
            setEmail(e.target.value)
            SetIsValidEmail(true)
        }
    }

    const onSubmit = () => {
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

        if(!pattern.test(email)){
            SetIsValidEmail(false)
        }
        else{
            let users = localStorage.getItem("users")

            if(users){
                users = JSON.parse(users)

                users.push({
                    name,
                    email,
                    country,
                    status : "Disable",
                    date : new Date().toDateString()
                })
            }
            else{
                users = [{
                    name,
                    email,
                    country,
                    status : "Disable",
                    date : new Date().toDateString()
                }]
            }

            localStorage.setItem("users", JSON.stringify(users))
            window.location.reload()
        }
    }
    return (
        <>
            {/* <Button onClick={onOpen}>Open Modal</Button> */}
            <Modal isOpen={props.isOpen} onClose={props.setActions}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel
                                display='flex'
                                ms='4px'
                                fontSize='sm'
                                fontWeight='500'
                                color={textColor}
                                mb='8px'>
                                Email<Text color={brandStars}>*</Text>
                            </FormLabel>
                            <Input
                                isInvalid={!isValidEmail}
                                errorBorderColor="red.300"
                                isRequired={true}
                                fontSize='sm'
                                ms={{ base: "0px", md: "0px" }}
                                type='email'
                                placeholder='Enter Email'
                                mb='24px'
                                fontWeight='500'
                                size='lg'
                                value={email}
                                onChange={changeEmail}
                            />
                            <FormLabel
                                ms='4px'
                                fontSize='sm'
                                fontWeight='500'
                                color={textColor}
                                display='flex'>
                                Name<Text color={brandStars}>*</Text>
                            </FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    isInvalid={!isValidName}
                                    errorBorderColor="red.300"
                                    isRequired={true}
                                    fontSize='sm'
                                    placeholder='Enter your name'
                                    mb='24px'
                                    size='lg'
                                    type="text"
                                    value={name}
                                    onChange={changeName}
                                />
                            </InputGroup>
                            <FormLabel
                                ms='4px'
                                fontSize='sm'
                                fontWeight='500'
                                color={textColor}
                                display='flex'>
                                Country<Text color={brandStars}>*</Text>
                            </FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    isInvalid={!isvalidCountry}
                                    errorBorderColor="red.300"
                                    isRequired={true}
                                    fontSize='sm'
                                    placeholder='Country'
                                    mb='24px'
                                    size='lg'
                                    type="text"
                                    value={country}
                                    onChange={changeCountry}

                                />
                            </InputGroup>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" mr={3} onClick={props.setActions}>
                            Close
                        </Button>
                        <Button isDisabled={!isValidEmail || !isValidName || !isvalidCountry} variant="ghost" onClick={onSubmit}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserModal

