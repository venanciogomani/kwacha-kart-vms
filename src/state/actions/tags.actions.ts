import { createAction } from "@ngrx/store";
import { ProductTagModel } from "../models";

export enum TagsActionTypes {
    LoadTags = '[Tags] Load Tags',
    LoadTagsSuccess = '[Tags] Load Tags Success',
    LoadSingleTag = '[Tags] Load Single Tag',
    LoadSingleTagSuccess = '[Tags] Load Single Tag Success',
    AddTag = '[Tags] Add Tag',
    AddTagSuccess = '[Tags] Add Tag Success',
    EditTag = '[Tags] Edit Tag',
    EditTagSuccess = '[Tags] Edit Tag Success',
    DeleteTag = '[Tags] Delete Tag',
    DeleteTagSuccess = '[Tags] Delete Tag Success',
}

export const loadTags = createAction(
    TagsActionTypes.LoadTags
);

export const loadTagsSuccess = createAction(
    TagsActionTypes.LoadTagsSuccess,
    (tags: ProductTagModel[]) => ({ tags }),
);

export const loadSingleTag = createAction(
    TagsActionTypes.LoadSingleTag,
    (id: string) => ({ id }),
);

export const loadSingleTagSuccess = createAction(
    TagsActionTypes.LoadSingleTagSuccess,
    (tag: ProductTagModel) => ({ tag }),
);

export const addTag = createAction(
    TagsActionTypes.AddTag,
    (tag: ProductTagModel) => ({ tag }),
);

export const addTagSuccess = createAction(
    TagsActionTypes.AddTagSuccess,
    (tag: ProductTagModel) => ({ tag }),
);

export const editTag = createAction(
    TagsActionTypes.EditTag,
    (tag: ProductTagModel) => ({ tag }),
);

export const editTagSuccess = createAction(
    TagsActionTypes.EditTagSuccess,
    (tag: ProductTagModel) => ({ tag }),
);

export const deleteTag = createAction(
    TagsActionTypes.DeleteTag,
    (id: string) => ({ id }),
);

export const deleteTagSuccess = createAction(
    TagsActionTypes.DeleteTagSuccess,
    (id: string) => ({ id }),
);