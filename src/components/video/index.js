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
  Progress,
} from "@chakra-ui/react";
import { EVENT_TYPES } from "../../constants";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { formatBytes, formatDate } from "../../utils";

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
    const lastUpdated = formatDate(video.lastModified, "DD-MM-YYYY");

    if (!videoKey) return [];
    return [videoSize, videoType, lastUpdated];
  }, []);

  return (
    <Box
      // borderWidth="1px"
      borderRadius="lg"
      bg={isOpen ? "brand.buttonText" : "brand.bg"}
      cursor="pointer"
      px={4}
      pb={4}
      _hover={{
        bg: "brand.bgHover",
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
        pt={4}
        gap={4}
        onClick={() => {
          onToggle();
          setIsPlaying(true);
        }}
      >
        <Flex alignItems="center" gap={2}>
          <Icon
            as={ChevronRightIcon}
            w={7}
            h={7}
            transition="transform 0.3s ease"
            transform={isOpen ? "rotate(270deg)" : "rotate(90deg)"}
            color={isOpen ? "brand.secondary" : "brand.buttonText"}
          />
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

        <Flex alignItems="center">
          {/* <Icon
            as={ChevronRightIcon}
            w={6}
            h={6}
            transition="transform 0.3s ease"
            transform={isOpen ? "rotate(270deg)" : "rotate(90deg)"}
            color={isOpen ? "brand.secondary" : "brand.buttonText"}
          /> */}
          {/* <Center height="35px" color="brand.secondary" mr="7px">
            <Divider orientation="vertical" />
          </Center> */}
          <Button as="a" href={video.url} download minWidth={["100%", "200px"]}>
            {isOpen ? "Tải video" : "Tải nhanh"}
          </Button>
        </Flex>
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
