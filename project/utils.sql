DROP MATERIALIZED VIEW tag_children;

CREATE MATERIALIZED VIEW tag_children AS
    WITH RECURSIVE tag_req(parent_tag, child_tag) AS (
        SELECT parent_tag, child_tag 
        FROM tag_child
        
        UNION ALL

        SELECT tag_child.parent_tag, tag_child.child_tag
        FROM tag_child, tag_req
        WHERE tag_child.parent_tag = tag_req.child_tag
    )
    SELECT parent.tag_name as parent_tag, child.tag_name as child_tag
    FROM tag_req
    INNER JOIN tags as child ON child.tag_id = tag_req.child_tag
    INNER JOIN tags as parent ON parent.tag_id = tag_req.parent_tag;
