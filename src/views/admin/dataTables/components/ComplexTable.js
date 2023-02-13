import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

// Assets
import { MdCheckCircle, MdCancel, MdOutlineError, MdOutlineCreate } from "react-icons/md";
import { DeleteIcon } from "@chakra-ui/icons";
import EditUserModal from "components/userModals/editUserModal";
export default function ColumnsTable(props) {
  const { columnsData } = props;

  const [tableData, setTableData] = useState([])
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [editableData, setEditableData] = useState({})

  useEffect(() => {
    if (localStorage.getItem("users")) {
      let users = []
      users = localStorage.getItem("users")
      users = JSON.parse(users)

      setTableData(users)
    }
  }, [])

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const deleteRowFromTable = (index) => {
    let usersList = tableData;
    if (usersList.length > 0) {
      usersList.splice(index, 1)

      setTableData(usersList)
      localStorage.setItem("users", JSON.stringify(usersList))

      window.location.reload()
    }

  }

  const editUserData = (index, data) => {
    let usersList = tableData;
    if (usersList.length > 0) {
      usersList[index] = {
        ...usersList[index],
        ...data
      }

      setTableData(usersList)
      localStorage.setItem("users", JSON.stringify(usersList))

      window.location.reload()
    }
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
  }

  return (
    <>
      <Card
        direction='column'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex px='25px' justify='space-between' mb='20px' align='center'>
          <Text
            color={textColor}
            fontSize='22px'
            fontWeight='700'
            lineHeight='100%'>
            User Table
          </Text>
          <Menu />
        </Flex>
        <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe='10px'
                    key={index}
                    borderColor={borderColor}>
                    <Flex
                      justify='space-between'
                      align='center'
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color='gray.400'>
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "NAME") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      );
                    }
                    else if (cell.column.Header === "EMAIL") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      );
                    }
                    else if (cell.column.Header === "COUNTRY") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      );
                    }
                    else if (cell.column.Header === "STATUS") {
                      data = (
                        <Flex align='center'>
                          <Icon
                            w='24px'
                            h='24px'
                            me='5px'
                            color={
                              cell.value === "Approved"
                                ? "green.500"
                                : cell.value === "Disable"
                                  ? "red.500"
                                  : cell.value === "Error"
                                    ? "orange.500"
                                    : null
                            }
                            as={
                              cell.value === "Approved"
                                ? MdCheckCircle
                                : cell.value === "Disable"
                                  ? MdCancel
                                  : cell.value === "Error"
                                    ? MdOutlineError
                                    : null
                            }
                          />
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "DATE") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      );
                    }
                    // else if (cell.column.Header === "PROGRESS") {
                    //   data = (
                    //     <Flex align='center'>
                    //       <Progress
                    //         variant='table'
                    //         colorScheme='brandScheme'
                    //         h='8px'
                    //         w='108px'
                    //         value={cell.value}
                    //       />
                    //     </Flex>
                    //   );
                    // }
                    else if (cell.column.Header === "ACTION") {
                      data = (
                        <Flex align='center' direction={"row"} gap={2}>
                          <DeleteIcon w={6} h={6} color="red.500" style={{ cursor: "pointer" }} onClick={() => deleteRowFromTable(cell.row.index)} />
                          <Icon as={MdOutlineCreate} color="blue.500" w={6} h={6} style={{ cursor: "pointer" }} onClick = {() =>{
                            setEditableData({...tableData[cell.row.index], index:cell.row.index })
                            setEditModalOpen(true)
                          }} />
                        </Flex>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor='transparent'>
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Card>
      <EditUserModal
        closeEditModal = {closeEditModal}
        isEditModalOpen = {isEditModalOpen}
        editUserData = {editUserData}
        name = {editableData.name}
        email = {editableData.email}
        country = {editableData.country}
        status = {editableData.status}
        index = {editableData.index}
      />
    </>
  );
}
