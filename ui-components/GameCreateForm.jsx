/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SelectField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { Game } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function GameCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    PlayerX: "",
    PlayerO: "",
    Board: [],
    IsWinner: "",
    CurrentPlayer: "",
  };
  const [PlayerX, setPlayerX] = React.useState(initialValues.PlayerX);
  const [PlayerO, setPlayerO] = React.useState(initialValues.PlayerO);
  const [Board, setBoard] = React.useState(initialValues.Board);
  const [IsWinner, setIsWinner] = React.useState(initialValues.IsWinner);
  const [CurrentPlayer, setCurrentPlayer] = React.useState(
    initialValues.CurrentPlayer
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPlayerX(initialValues.PlayerX);
    setPlayerO(initialValues.PlayerO);
    setBoard(initialValues.Board);
    setCurrentBoardValue("");
    setIsWinner(initialValues.IsWinner);
    setCurrentPlayer(initialValues.CurrentPlayer);
    setErrors({});
  };
  const [currentBoardValue, setCurrentBoardValue] = React.useState("");
  const BoardRef = React.createRef();
  const validations = {
    PlayerX: [],
    PlayerO: [],
    Board: [],
    IsWinner: [],
    CurrentPlayer: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          PlayerX,
          PlayerO,
          Board,
          IsWinner,
          CurrentPlayer,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(new Game(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "GameCreateForm")}
      {...rest}
    >
      <TextField
        label="Player x"
        isRequired={false}
        isReadOnly={false}
        value={PlayerX}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              PlayerX: value,
              PlayerO,
              Board,
              IsWinner,
              CurrentPlayer,
            };
            const result = onChange(modelFields);
            value = result?.PlayerX ?? value;
          }
          if (errors.PlayerX?.hasError) {
            runValidationTasks("PlayerX", value);
          }
          setPlayerX(value);
        }}
        onBlur={() => runValidationTasks("PlayerX", PlayerX)}
        errorMessage={errors.PlayerX?.errorMessage}
        hasError={errors.PlayerX?.hasError}
        {...getOverrideProps(overrides, "PlayerX")}
      ></TextField>
      <TextField
        label="Player o"
        isRequired={false}
        isReadOnly={false}
        value={PlayerO}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              PlayerX,
              PlayerO: value,
              Board,
              IsWinner,
              CurrentPlayer,
            };
            const result = onChange(modelFields);
            value = result?.PlayerO ?? value;
          }
          if (errors.PlayerO?.hasError) {
            runValidationTasks("PlayerO", value);
          }
          setPlayerO(value);
        }}
        onBlur={() => runValidationTasks("PlayerO", PlayerO)}
        errorMessage={errors.PlayerO?.errorMessage}
        hasError={errors.PlayerO?.hasError}
        {...getOverrideProps(overrides, "PlayerO")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              PlayerX,
              PlayerO,
              Board: values,
              IsWinner,
              CurrentPlayer,
            };
            const result = onChange(modelFields);
            values = result?.Board ?? values;
          }
          setBoard(values);
          setCurrentBoardValue("");
        }}
        currentFieldValue={currentBoardValue}
        label={"Board"}
        items={Board}
        hasError={errors?.Board?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("Board", currentBoardValue)
        }
        errorMessage={errors?.Board?.errorMessage}
        setFieldValue={setCurrentBoardValue}
        inputFieldRef={BoardRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Board"
          isRequired={false}
          isReadOnly={false}
          value={currentBoardValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.Board?.hasError) {
              runValidationTasks("Board", value);
            }
            setCurrentBoardValue(value);
          }}
          onBlur={() => runValidationTasks("Board", currentBoardValue)}
          errorMessage={errors.Board?.errorMessage}
          hasError={errors.Board?.hasError}
          ref={BoardRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "Board")}
        ></TextField>
      </ArrayField>
      <SelectField
        label="Is winner"
        placeholder="Please select an option"
        isDisabled={false}
        value={IsWinner}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              PlayerX,
              PlayerO,
              Board,
              IsWinner: value,
              CurrentPlayer,
            };
            const result = onChange(modelFields);
            value = result?.IsWinner ?? value;
          }
          if (errors.IsWinner?.hasError) {
            runValidationTasks("IsWinner", value);
          }
          setIsWinner(value);
        }}
        onBlur={() => runValidationTasks("IsWinner", IsWinner)}
        errorMessage={errors.IsWinner?.errorMessage}
        hasError={errors.IsWinner?.hasError}
        {...getOverrideProps(overrides, "IsWinner")}
      >
        <option
          children="X"
          value="X"
          {...getOverrideProps(overrides, "IsWinneroption0")}
        ></option>
        <option
          children="O"
          value="O"
          {...getOverrideProps(overrides, "IsWinneroption1")}
        ></option>
      </SelectField>
      <SelectField
        label="Current player"
        placeholder="Please select an option"
        isDisabled={false}
        value={CurrentPlayer}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              PlayerX,
              PlayerO,
              Board,
              IsWinner,
              CurrentPlayer: value,
            };
            const result = onChange(modelFields);
            value = result?.CurrentPlayer ?? value;
          }
          if (errors.CurrentPlayer?.hasError) {
            runValidationTasks("CurrentPlayer", value);
          }
          setCurrentPlayer(value);
        }}
        onBlur={() => runValidationTasks("CurrentPlayer", CurrentPlayer)}
        errorMessage={errors.CurrentPlayer?.errorMessage}
        hasError={errors.CurrentPlayer?.hasError}
        {...getOverrideProps(overrides, "CurrentPlayer")}
      >
        <option
          children="X"
          value="X"
          {...getOverrideProps(overrides, "CurrentPlayeroption0")}
        ></option>
        <option
          children="O"
          value="O"
          {...getOverrideProps(overrides, "CurrentPlayeroption1")}
        ></option>
      </SelectField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
