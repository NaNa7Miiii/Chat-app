import { Modal, ModalContent, ModalHeader, ModalOverlay, Button, ModalFooter, ModalBody,
         ModalCloseButton, Heading } from "@chakra-ui/react"
import { Formik, Form } from "formik";
import TextField from "../TextField";
import { friendSchema } from "@whatsapp-clone/common";
import socket from "../../socket"
import { useCallback, useContext, useState } from "react";
import { FriendContext } from "./Home";

const AddFriendModel = ({isOpen, onClose}) => {
  const [error, setError] = useState("");
  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);
  const {setFriendList} = useContext(FriendContext)
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a friend!</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{friendName: ""}}
          onSubmit={values => {
          socket.emit("add_friend", values.friendName, ({errorMsg, done, newFriend})=> {
            if (done) {
              setFriendList(c => [newFriend, ...c]);
              closeModal();
              return;
            }
            setError(errorMsg);
          });
          }}
          validationSchema={friendSchema}
        >
          <Form>
            <ModalBody>
              <Heading fontSize="xl" color="red.500" textAlign="center">
                {error}
              </Heading>
              <TextField
                label="Friend's name"
                placeholder="Enter friend's username..."
                autoComplete="off"
                name="friendName"/>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default AddFriendModel
