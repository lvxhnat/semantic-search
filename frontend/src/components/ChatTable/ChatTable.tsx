import * as React from "react";
import * as S from "./style";
import moment from "moment";
import { DbEntries } from "../../pages/Home/types";
import { ReferenceIds } from "../ChatBox/ChatBox";
import { request } from "../../common/services/request";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Skeleton, Typography } from "@mui/material";

interface Column {
  id: "node_id" | "title" | "state" | "url" | "created_at" | "body";
  label: string;
  width?: number;
  maxWidth?: number;
  align?: "right" | "left";
  format?: (value: string) => string;
}

const columns: readonly Column[] = [
  { id: "node_id", label: "ID", width: 50 },
  { id: "title", label: "Title" },
  {
    id: "state",
    label: "State",
    align: "right",
  },
  {
    id: "body",
    label: "Description",
    align: "left",
    maxWidth: 200,
  },
  {
    id: "created_at",
    label: "Created At",
    align: "left",
    format: (value: string) => moment(new Date(value)).format("YYYY-MM-DD"),
  },
];

interface ChatTableProps {
  referenceIds: ReferenceIds;
}

export default function ChatTable(props: ChatTableProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [entries, setEntries] = React.useState<DbEntries[]>([]);
  React.useEffect(() => {
    setLoading(true);
    request()
      .post("db-entries", { uuids: Object.keys(props.referenceIds) })
      .then((res) => {
        setEntries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  }, []);

  return loading ? (
    <Skeleton sx={{ height: 500, width: "100%" }} />
  ) : (
    <S.StyledTableContainer>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((row) => {
              return (
                <S.StyledTableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  onClick={() => (window.location.href = row.url)}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          width={column.width}
                          maxWidth={column.maxWidth}
                          color="inherit"
                        >
                          {column.format ? column.format(value) : value}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </S.StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </S.StyledTableContainer>
  );
}
