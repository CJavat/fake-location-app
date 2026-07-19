import Ionicons from "@react-native-vector-icons/ionicons";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface Props {
  iconName: IoniconName;
  iconSize: number;
  style?: StyleProp<ViewStyle>;
  lineTop?: boolean;
  lineBottom?: boolean;

  action: () => void;
}

export const IoniconPressable = ({
  style,
  iconName,
  iconSize,
  lineTop = false,
  lineBottom = false,
  action,
}: Props) => {
  return (
    <>
      {lineTop && (
        <View
          style={{
            borderTopColor: "#b2b2b2",
            borderTopWidth: 1,
          }}
        ></View>
      )}

      <Pressable onPress={() => action()}>
        <Ionicons name={iconName} size={iconSize} />
      </Pressable>

      {lineBottom && (
        <View
          style={{
            borderBottomColor: "#b2b2b2",
            borderBottomWidth: 1,
          }}
        ></View>
      )}
    </>
  );
};
