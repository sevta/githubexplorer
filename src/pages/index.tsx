import {
  Accordion,
  Button,
  Container,
  Flex,
  Group,
  Input,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconStar } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";

const api = "https://api.github.com";

type User = {
  name: string;
  id: string | number;
  login: string;
} & Record<any, any>;

type Repo = {
  name: string;
  description: string;
  stargazers_count: number;
} & Record<any, any>;

export default function Home() {
  const [searchKey, setSearchKey] = useInputState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<User[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);

  async function submitSearch() {
    setLoading(true);

    try {
      const resp = await axios.get(api + "/search/users?q=" + searchKey);
      setData(resp?.data.items?.slice(0, 5));
      if (resp?.data) {
        const getRepos = await axios.get(
          api + "/users/" + searchKey + "/repos"
        );
        setRepos(getRepos?.data);
      }
    } catch (error: any) {
      showNotification({ color: "red", message: error?.message || "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="lg" py="lg">
      <Stack>
        <Input
          placeholder="Enter username"
          onChange={setSearchKey}
          value={searchKey}
        />
        <Button
          disabled={searchKey.length === 0}
          fullWidth
          loading={loading}
          onClick={submitSearch}
        >
          Search
        </Button>
        {data !== undefined && (
          <Text size="sm">Showing users for "{searchKey}"</Text>
        )}
      </Stack>
      {data?.map((d, i) => (
        <Accordion variant="filled" mt="sm">
          <Accordion.Item value={d?.id?.toString() || "1"} px={0}>
            <Accordion.Control>
              <Text weight={600} size="lg">
                {d?.login || "-"}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                {repos.length === 0 ? (
                  <Text>No repos</Text>
                ) : (
                  repos?.map((repo, indexRepo: number) => (
                    <Paper withBorder py="md" px="xs" bg="gray.3">
                      <Flex justify="space-between">
                        <Text weight={600}>{repo?.name}</Text>
                        <Group>
                          <Text weight={600}>{repo?.stargazers_count}</Text>
                          <IconStar size={14} />
                        </Group>
                      </Flex>
                      <Text size="sm">{repo?.description}</Text>
                    </Paper>
                  ))
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ))}
    </Container>
  );
}
