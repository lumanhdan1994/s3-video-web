import { useState, useCallback } from "react";
import {
  Box,
  Collapse,
  Text,
  Button,
  useDisclosure,
  Flex,
  Icon,
  Tag,
  Divider,
  Center,
} from "@chakra-ui/react";
import { EVENT_TYPES } from "../../constants";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { formatBytes } from "../../utils";

const VideoComp = ({ video }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [isPlaying, setIsPlaying] = useState(false);
  const getVideoTitle = useCallback((video) => {
    const videoKey = video.key.replace(/\.mp4$/i, "");
    const keys = videoKey.split("-");
    const eventType = EVENT_TYPES["vi"][keys[0]] ?? keys[0];
    const playerA = keys[1];
    const playerB = keys[2];

    if (!videoKey) return "";
    return `${eventType} - ${playerA} vs ${playerB}`;
  }, []);
  const getVideoAttr = useCallback((video) => {
    const videoKey = video.key;
    const videoType = videoKey.split(".")[1];
    const videoSize = formatBytes(video.size);

    if (!videoKey) return [];
    return [videoType, videoSize];
  }, []);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      bg={isOpen ? "brand.buttonText" : "brand.bg"}
      cursor="pointer"
      _hover={{
        bg: "brand.buttonText",
        color: "brand.secondary",
        ".video-title, .chakra-icon": {
          color: "brand.secondary",
        },
      }}
    >
      <Flex
        justifyContent="space-between"
        alignItems={["start", "center"]}
        direction={["column", "row"]}
      p={4}
        gap={4}
        onClick={() => {
          onToggle();
          setIsPlaying(true);
        }}
      >
        <Flex alignItems="center">
          <Icon
            as={isOpen ? ChevronDownIcon : ChevronLeftIcon}
            w={6}
            h={6}
            color={isOpen ? "brand.secondary" : "brand.buttonText"}
          />
          <Center height="45px" color="brand.secondary" mr="10px">
            <Divider orientation="vertical" />
          </Center>
          <Flex direction="column" alignItems="start" justifyContent="start">
            <Text
              className="video-title"
              fontWeight="bold"
              cursor="pointer"
              color={isOpen ? "brand.secondary" : "brand.buttonText"}
            >
              {getVideoTitle(video)}
            </Text>
            <Flex gap={2}>
              {getVideoAttr(video).map((attr, idx) => (
                <Tag key={idx} bg="brand.bgCard" color="brand.buttonText">
                  {attr}
                </Tag>
              ))}
            </Flex>
          </Flex>
        </Flex>

        <Button as="a" href={video.url} download minWidth={["100%", "200px"]}>
          {isOpen ? "Tải video" : "Tải nhanh"}
        </Button>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <video
          controls
          style={{ width: "100%", marginTop: "10px", borderRadius: "10px" }}
          src={video.url}
        />
      </Collapse>
    </Box>
  );
};

export default VideoComp;
