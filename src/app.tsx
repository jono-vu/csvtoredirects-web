import { useForm } from "react-hook-form";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Code,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { generateCsvLink, useMergeRedirects } from "./utils";

interface GenerateRedirectsCsvFormData {
  oldUrls: FileList;
  oldBaseUrl: boolean;
  oldBaseUrlToRemove: string;

  newUrls: FileList;
  newBaseUrl: boolean;
  newBaseUrlToRemove: string;

  similarityThreshhold: string;

  turboMatch: boolean;
}

const App = () => {
  const { mutate: mergeRedirects, output } = useMergeRedirects();

  const { register, watch, handleSubmit } =
    useForm<GenerateRedirectsCsvFormData>();

  async function onSubmit(values: GenerateRedirectsCsvFormData) {
    const oldUrlsCsv = await values.oldUrls[0].text();
    const newUrlsCsv = await values.newUrls[0].text();

    mergeRedirects({
      oldUrlsCsv,
      newUrlsCsv,

      oldBaseUrl: values.oldBaseUrlToRemove,
      newBaseUrl: values.newBaseUrlToRemove,
      similarityThreshhold: Number(values.similarityThreshhold) / 100,

      turboMatch: values.turboMatch,
    });
  }

  console.log(output);

  return (
    <Container maxWidth={1080} py={16}>
      <Stack gap={16}>
        <section id="generate">
          <Box as="header" fill="gray.100">
            <Heading as="h1" align="center">
              Create a Redirects file with 2 CSVs
            </Heading>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={16} mt={8} align="center">
              <Flex gap={4} flexWrap="wrap" justify="center">
                <Card variant="outline">
                  <CardHeader pb={0}>
                    <Heading as="h3" size="md">
                      Old URLs
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack>
                      <Card
                        variant="filled"
                        p={4}
                        borderColor="blue.400"
                        border={!watch("oldUrls")?.length ? "none" : undefined}
                      >
                        <input type="file" {...register("oldUrls")} />
                      </Card>

                      <Flex gap={2} as="label">
                        <input type="checkbox" {...register("oldBaseUrl")} />
                        <Text>Replace Base URL</Text>
                      </Flex>

                      {watch("oldBaseUrl") && (
                        <Input
                          {...register("oldBaseUrlToRemove")}
                          placeholder="https://example.com"
                        />
                      )}
                    </Stack>
                  </CardBody>
                </Card>

                <Card variant="outline">
                  <CardHeader pb={0}>
                    <Heading as="h3" size="md">
                      New URLs
                    </Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack>
                      <Card
                        variant="filled"
                        p={4}
                        borderColor="blue.400"
                        border={!watch("newUrls")?.length ? "none" : undefined}
                      >
                        <input type="file" {...register("newUrls")} />
                      </Card>

                      <Flex gap={2} as="label">
                        <input type="checkbox" {...register("newBaseUrl")} />
                        <Text>Replace Base URL</Text>
                      </Flex>

                      {watch("newBaseUrl") && (
                        <Input
                          {...register("newBaseUrlToRemove")}
                          placeholder="https://example.com"
                        />
                      )}
                    </Stack>
                  </CardBody>
                </Card>
              </Flex>

              <Flex gap={8} flexWrap="wrap">
                <Flex as="label" gap={2}>
                  <Text>Similarity Threshhold:</Text>
                  <input
                    defaultValue="90"
                    type="range"
                    min="0"
                    max="100"
                    {...register("similarityThreshhold")}
                  />
                  <Text>{watch("similarityThreshhold") || 90}%</Text>
                </Flex>

                <Flex gap={1} as="label">
                  <input type="checkbox" {...register("turboMatch")} />
                  <Text>Match slugs</Text>
                </Flex>
              </Flex>
            </Stack>
          </form>

          <Stack gap={4}>
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              size="lg"
              colorScheme={
                !watch("newUrls")?.length || !watch("oldUrls")?.length
                  ? "gray"
                  : "blue"
              }
              disabled={!watch("newUrls")?.length || !watch("oldUrls")?.length}
              mt={4}
            >
              Generate
            </Button>

            {output && (
              <Card variant="outline">
                <Text align="center" size="sm">
                  Preview
                </Text>
                <Divider />
                <TableContainer overflowY="auto" maxH={200} p={1}>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Old URL</Th>
                        <Th>New URL</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {output
                        .split("\n")
                        .filter((_, i) => i !== 0)
                        .map((row: string) => (
                          <Tr>
                            {row.split(",").map((cell) => (
                              <Td maxW={300} overflowX="hidden">
                                {cell}
                              </Td>
                            ))}
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Card>
            )}

            {output && (
              <Text
                align="center"
                as="a"
                color="blue.600"
                cursor="pointer"
                _hover={{
                  textDecor: "underline",
                }}
                onClick={() => {
                  generateCsvLink?.(output);
                }}
              >
                Download
              </Text>
            )}
          </Stack>
        </section>

        <Divider />

        <Stack as="section" id="documentation" gap={4}>
          <Heading as="h2" size="lg">
            Guide:
          </Heading>

          <Alert status="info" w="fit-content">
            <AlertIcon />
            <Text>Your inputs must be in this format:</Text>
          </Alert>

          <TableContainer>
            <Table
              size="sm"
              variant="simple"
              border="1px"
              borderColor="gray.200"
            >
              <Thead>
                <Tr>
                  <Th>Page Title</Th>
                  <Th>URL</Th>
                  <Th>etc...</Th>
                  <Th>etc...</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Pantene 2 Minute Miracle Daily Moisture Renewal | DDS</Td>
                  <Td>
                    https://www.discountdrugstores.com.au/pantene-3-minute-miracle-daily-moisture-renewal-intensive-serum-condit-p-4987176043399
                  </Td>
                  <Td>etc...</Td>
                  <Td>etc...</Td>
                </Tr>
                <Tr>
                  <Td>
                    Kleenex To Go Ultra Soft Handy Individual Packs - 6 Pack |
                    DDS
                  </Td>
                  <Td>
                    https://www.discountdrugstores.com.au/household/tissues---wipes/kleenex-to-go-ultra-soft-handy-individual-packs---6-x-9-pack-p-5029053003887
                  </Td>
                  <Td>etc...</Td>
                  <Td>etc...</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>

        <Divider />

        <Stack as="section" id="how-it-works" gap={4}>
          <Heading as="h2" size="lg">
            How it works:
          </Heading>
          <Text>
            This tool maps redirect URLs from an old site to a new site via
            matching The page titles together. This is can be used for SEOs and
            web developers to map a completely new site with fully migrated page
            titles, to preserve The link equity from The old site.
          </Text>

          <Text>
            If an old site contained a URL like
            <Code>/products/two-in-one-face-moisturiser-30g</Code> and it needed
            to be redirected to
            <Code>/shop/moisturisers/two-in-one-face-moisturiser?size=30g</Code>
            , this tool will look at the page titles of the original and figure
            out if the new page has a similar enough name to redirect the URL
            to.
          </Text>
        </Stack>

        <footer>
          <Text>c. Jonathan Vu 2023.</Text>
        </footer>
      </Stack>
    </Container>
  );
};

export { App };
