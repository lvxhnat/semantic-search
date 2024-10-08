import React from "react";
import * as S from "./style";
import { Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AbcIcon from "@mui/icons-material/Abc";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { ColorsEnum } from "../../common/theme";

interface MetaFocusChoiceProps {
  logo: React.ReactNode;
  title: string;
  body: string;
  selected: boolean;
  [others: string]: any;
}

const MetaFocusChoice = (props: MetaFocusChoiceProps) => {
  const { logo, title, body, selected, ...others } = props;
  return (
    <S.StyledMenuItemContainer selected={selected} {...others}>
      <S.StyledMenuItemTitle>
        {logo}
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      </S.StyledMenuItemTitle>
      <Typography
        variant="subtitle2"
        color={ColorsEnum.grey}
        sx={{ whiteSpace: "pre-line", lineHeight: 1.2 }}
      >
        {body}
      </Typography>
    </S.StyledMenuItemContainer>
  );
};

interface MetaFocusProps {
  onClick?: (choice: string) => void;
  isNewConversation: boolean
}

type SelectedModelTypes = "general" | "medical-patient" | "medical-expert";

export default function MetaFocus(props: MetaFocusProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = React.useState<SelectedModelTypes>("general");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const models = {
    general: {
      title: "General",
      body: "Model generalised for all use cases",
      logo: <AbcIcon fontSize="small" />,
    },
    "medical-patient": {
      title: "Medical Patient",
      body: "Search and understand more about medical terminology",
      logo: <MedicalServicesIcon fontSize="small" />,
    },
    "medical-expert": {
      title: "Medical Expert",
      body: "Technical model trained to explore insights in the medical field",
      logo: <MedicalInformationIcon fontSize="small" />,
    },
  };

  const handleClose = (id: SelectedModelTypes) => {
    setAnchorEl(null);
    setSelected(id);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent event bubbling
    setAnchorEl(event.currentTarget);
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open the file dialog
    }
  };

  return (
    <React.Fragment>
      <S.StyledButton
        disabled={!props.isNewConversation}
        startIcon={
          selected && models[selected] ? (
            models[selected].logo
          ) : (
            <FilterListIcon fontSize="small" />
          )
        }
        onClick={handleClick}
        disableRipple
      >
        <Typography variant="subtitle2">
          {selected && models[selected] ? models[selected].title : "Focus"}
        </Typography>
      </S.StyledButton>
      <S.StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {(
          [
            "general",
            "medical-patient",
            "medical-expert",
          ] as SelectedModelTypes[]
        ).map((id: SelectedModelTypes) => {
          return (
            <S.StyledMenuItem key={id}>
              <MetaFocusChoice
                selected={selected === id}
                onClick={() => handleClose(id)}
                title={models[id].title}
                body={models[id].body}
                logo={models[id].logo}
              />
            </S.StyledMenuItem>
          );
        })}
      </S.StyledMenu>
    </React.Fragment>
  );
}
