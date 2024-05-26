import { ChatIcon } from "@chakra-ui/icons"
import { Divider, Heading, HStack, VStack, Text, Circle, useDisclosure } from "@chakra-ui/react"
import { Button } from "@chakra-ui/button";
import { Tab, TabList } from "@chakra-ui/tabs";
import { useContext } from "react";
import { FriendContext } from "./Home";
import AddFriendModel from "./AddFriendModal";

const Sidebar = () => {
  const {friendList} = useContext(FriendContext);
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
    <VStack py="1.4rem">
      <HStack justify="space-evenly" w="100%">
        <Heading size="md">Add Friend</Heading>
        <Button onClick={onOpen}>
          <ChatIcon />
        </Button>
      </HStack>
      <Divider />
      <VStack as={TabList}>
        {friendList.map(friend => (
          <HStack as={Tab} key={`friend:${friend}`}>
            <Circle
            bg={friend.connected ? "green.700" : "red.500"}
            w = "20px"
            h = "20px"
            />
          <Text>{friend.username}</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
    <AddFriendModel isOpen={isOpen} onClose={onClose}/>
    </>
  )
}

export default Sidebar
