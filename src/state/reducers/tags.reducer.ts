import { createReducer, on } from "@ngrx/store";
import {
    loadTags,
    loadTagsSuccess,
    loadSingleTag,
    loadSingleTagSuccess,
    addTag,
    addTagSuccess,
    editTag,
    editTagSuccess,
    deleteTag,
    deleteTagSuccess,
} from "../actions/tags.actions";
import { ProductTagModel } from "../models";

export interface TagsState {
    tags: ProductTagModel[];
    loading: boolean;
}

export const initialState: TagsState = {
    tags: [],
    loading: false,
};

export const tagsReducer = createReducer(
    initialState,
    on(loadTags, (state) => ({ ...state, loading: true })),
    on(loadTagsSuccess, (state, { tags }) => ({ ...state, tags: tags, loading: false })),
    on(loadSingleTag, (state) => ({ ...state, loading: true })),
    on(loadSingleTagSuccess, (state, { tag }) => ({ ...state, tags: [...state.tags, tag], loading: false })),
    on(addTag, (state) => ({ ...state, loading: true })),
    on(addTagSuccess, (state, { tag }) => ({ ...state, tags: [...state.tags, tag], loading: false })),
    on(editTag, (state) => ({ ...state, loading: true })),
    on(editTagSuccess, (state, { tag }) => ({ ...state, tags: [...state.tags, tag], loading: false })),
    on(deleteTag, (state) => ({ ...state, loading: true })),
    on(deleteTagSuccess, (state, { id }) => ({ ...state, tags: state.tags.filter(tag => tag.id !== id), loading: false })),
);

export function reducer(state: TagsState | undefined, action: any) {
    return tagsReducer(state, action);
}