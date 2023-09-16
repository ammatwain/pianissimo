//import { TFixedNumberArray, TVariableMajorKeyNumberArray, TMajorKey } from "./TFieldTypes";
import { TRackObject } from "./TRackObject";
import { TScoreObject } from "./TScoreObject";
import { TSheetObject } from "./TSheetObject";


export type TLibraryObject = TRackObject | TScoreObject | TSheetObject;
